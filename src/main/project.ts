import { app } from 'electron';
import Store from 'electron-store';
import * as path from 'path';
import * as fs from 'fs';

import { ProjectPOJO } from '@shared/project-pojo';
import { getQualifiedInputId } from '@shared/util';
import { deviceConfigFromDTO } from '@shared/hardware-config';
import { inputConfigsFromDTO } from '@shared/hardware-config/input-config';
import { BaseInputConfig, MessageTransport } from '@plugins/types';
import { DeviceConfig } from '@shared/hardware-config/device-config';
import { DRIVERS } from '@shared/drivers';
import { DeviceDriver } from '@shared/driver-types/device-driver';

import { upgradeProject } from 'helper/project-upgrader';

import { HardwarePortService } from './port-service';
import { VirtualPortService } from './port-service/virtual/virtual-port-service';
import { WindowProvider } from './window-provider';
import { dialogs } from './dialogs';
import { InputRegistry } from './registry/input-registry';
import { PluginRegistry } from './registry/plugin-registry';
import { DeviceRegistry } from './registry/device-registry';

import {
  createDevicePluginFromDTO,
  createInputPluginFromDTO,
} from './create-plugin-from-dto';
import { AnonymousDeviceConfig } from '@shared/hardware-config/anonymous-device-config';
import { SupportedDeviceConfig } from '@shared/hardware-config/supported-device-config';
import { AdapterDeviceConfig } from '@shared/hardware-config/adapter-device-config';

const { MainWindow } = WindowProvider;

export const CURRENT_VERSION = 6;

/** The most recently used folder path */
let currentPath: string | undefined;

const SAVE_DIR_KEY = 'dir';
const store = new Store();

/**
 * Retrieves the recommended directory for saving or opening projects.
 * @returns The path to the recommended directory.
 */
function getRecommendedDir(): string {
  return store.get(SAVE_DIR_KEY, app.getPath('desktop')) as string;
}

async function loadInputPlugins(config: BaseInputConfig, proj: ProjectPOJO) {
  // TODO: if inputs and devices are responsible for initializing their
  // own plugins, we don't need a getPlugins() function
  await Promise.all(
    config.getPlugins().map(async (id) => {
      const dto = proj.plugins[id];

      const plugins = await config.initPluginsFromDTO(
        createInputPluginFromDTO.bind(null, dto)
      );

      plugins.forEach((p) => PluginRegistry.register(p.id, p));
    })
  );
}

async function loadDevicePlugins(config: DeviceConfig, proj: ProjectPOJO) {
  const initDevicePlugin = async (id: string) => {
    return createDevicePluginFromDTO(proj.plugins[id]);
  };

  const plugins = await config.initPluginsFromDTO(initDevicePlugin);
  plugins.forEach((p) => PluginRegistry.register(p.id, p));
}

/**
 * Loads input configurations from the project data.
 * @param proj - The project data object.
 */
async function loadInputs(proj: ProjectPOJO) {
  await Promise.all(
    Object.values(proj.inputs).map(async (inputDTO) => {
      const parentConfigDTO = proj.devices[inputDTO.deviceId];
      let parentDriver: DeviceDriver | undefined;

      if (parentConfigDTO.type === 'adapter') {
        if (parentConfigDTO.child === undefined) {
          throw new Error('cannot look up inputs for unset adapter child');
        }

        parentDriver = DRIVERS.get(parentConfigDTO.child.driverName);
      } else {
        parentDriver = DRIVERS.get(parentConfigDTO.driverName);
      }

      if (parentDriver === undefined) {
        throw new Error('unable to load device driver');
      }

      const config = inputConfigsFromDTO(parentDriver, inputDTO);
      const qualifiedInputId = getQualifiedInputId(
        inputDTO.deviceId,
        inputDTO.id
      );
      InputRegistry.register(qualifiedInputId, config);

      // Load plugins
      await loadInputPlugins(config, proj);
    })
  );
}

/**
 * Loads device configurations from the project data.
 * @param proj - The project data object.
 */
async function loadDevices(proj: ProjectPOJO) {
  await Promise.all(
    Object.values(proj.devices).map(async (deviceDTO) => {
      const deviceConfig = deviceConfigFromDTO(deviceDTO);
      DeviceRegistry.register(deviceDTO.id, deviceConfig);

      await loadDevicePlugins(deviceConfig, proj);
    })
  );
}

/**
 * Initializes a new default project with no configurations.
 */
export async function initDefault(): Promise<void> {
  currentPath = undefined;

  MainWindow.title = 'Untitled Project';
  MainWindow.edited = false;

  PluginRegistry.clear();
  InputRegistry.clear();
  DeviceRegistry.clear();

  MainWindow.setConfiguredDevices([]);
  MainWindow.setInputConfigs([]);
  MainWindow.setPlugins([]);

  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();
}

/**
 * Loads a project from the specified file path.
 * @param filePath - The path to the project file.
 */
export async function loadProject(filePath: string): Promise<void> {
  const jsonString = fs.readFileSync(filePath, 'utf8');
  const proj = upgradeProject(jsonString) as ProjectPOJO;
  app.addRecentDocument(filePath);

  PluginRegistry.clear();
  InputRegistry.clear();
  DeviceRegistry.clear();

  await loadInputs(proj);
  await loadDevices(proj);

  currentPath = filePath;

  MainWindow.title = path.basename(filePath);
  MainWindow.edited = false;

  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();

  MainWindow.setPlugins(PluginRegistry.getAll().map((p) => p.toDTO()));
  MainWindow.setInputConfigs(InputRegistry.getAll().map((p) => p.toDTO()));
  MainWindow.setConfiguredDevices(
    DeviceRegistry.getAll().map((d) => d.toDTO())
  );

  // Send intitionalization messages to the frontend
  // TODO: this is really horrible
  DeviceRegistry.getAll()
    .filter((d) => !(d instanceof AnonymousDeviceConfig))
    .map((d) => d as SupportedDeviceConfig | AdapterDeviceConfig)
    .forEach((d) => {
      d.inputs.forEach((i) => {
        const inputConfig = InputRegistry.get(getQualifiedInputId(d.id, i));

        if (!inputConfig) throw new Error();

        const transport: MessageTransport = {
          send: (msg) => {
            MainWindow.sendLoopbackMessage(d.id, i, msg);
          },
          applyThrottle: () => {},
        };

        inputConfig.init(transport, PluginRegistry);
      });
    });
}

/**
 * Serializes the current project state into an object.
 * @returns The serialized project object.
 */
function serializeProject(): ProjectPOJO {
  return {
    inputs: InputRegistry.toSerializable(),
    devices: DeviceRegistry.toSerializable(),
    plugins: PluginRegistry.toSerializable(),
    version: CURRENT_VERSION,
  };
}

/**
 * Writes the project data to the specified file path.
 * @param filePath - The path to save the project file.
 */
function writeProjectToFile(filePath: string): void {
  const projectObject = serializeProject();

  fs.writeFileSync(filePath, JSON.stringify(projectObject, null, 2));

  app.addRecentDocument(filePath);
  MainWindow.edited = false;
  MainWindow.title = path.basename(filePath);
}

/**
 * Opens a dialog for the user to select a location and saves the project to the chosen path.
 */
export async function saveAs(): Promise<void> {
  const suggestedName = currentPath
    ? path.basename(currentPath)
    : 'Untitled Project';
  const recommendedDirectory = getRecommendedDir();

  const result = await dialogs.save(recommendedDirectory, suggestedName);

  if (result.canceled) {
    throw new Error('Save operation was canceled by the user.');
  }
  if (!result.filePath) {
    throw new Error('No file path was provided for saving.');
  }

  const { filePath } = result;
  store.set(SAVE_DIR_KEY, path.dirname(filePath));

  currentPath = filePath;
  writeProjectToFile(currentPath);
}

/**
 * Saves the current project to disk. If no default path exists, it triggers a save dialog.
 */
export async function save(): Promise<void> {
  if (!currentPath) {
    await saveAs();
    return;
  }

  writeProjectToFile(currentPath);
}

/**
 * Opens a dialog for the user to select a project file and loads it.
 */
export async function open(): Promise<void> {
  const recommendedDirectory = getRecommendedDir();

  const result = await dialogs.open(recommendedDirectory);

  if (result.canceled) {
    throw new Error('Open operation was canceled by the user.');
  }
  if (!result.filePaths || result.filePaths.length === 0) {
    throw new Error('No file was selected for opening.');
  }

  const filePath = result.filePaths[0];
  store.set(SAVE_DIR_KEY, path.dirname(filePath));

  await loadProject(filePath);
}
