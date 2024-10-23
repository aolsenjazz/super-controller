import { app } from 'electron';
import Store from 'electron-store';
import * as path from 'path';
import * as fs from 'fs';

import { ProjectPOJO } from '@shared/project-pojo';
import { getQualifiedInputId } from '@shared/util';
import { deviceConfigFromDTO } from '@shared/hardware-config';
import { inputConfigsFromDTO } from '@shared/hardware-config/input-config';

import { upgradeProject } from 'helper/project-upgrader';

import { HardwarePortService } from './port-service';
import { VirtualPortService } from './port-service/virtual/virtual-port-service';
import { WindowProvider } from './window-provider';
import { dialogs } from './dialogs';
import { InputRegistry } from './input-registry';
import { PluginRegistry } from './plugin-registry';
import { DeviceRegistry } from './device-registry';

import { createPluginFromDTO } from './create-plugin-from-dto';

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

/**
 * Loads plugins from the project data.
 * @param proj - The project data object.
 */
async function loadPlugins(proj: ProjectPOJO): Promise<void> {
  const pluginPromises = proj.plugins.map((pluginDTO) =>
    createPluginFromDTO(pluginDTO)
      .then((plugin) => {
        PluginRegistry.register(plugin.id, plugin);
        MainWindow.upsertPlugin(plugin.toDTO());
        return false;
      })
      .catch((error) => {
        // Handle plugin loading errors if necessary
        throw new Error(`Failed to load plugin ${pluginDTO.id}: ${error}`);
      })
  );
  await Promise.all(pluginPromises);
}

/**
 * Loads input configurations from the project data.
 * @param proj - The project data object.
 */
function loadInputs(proj: ProjectPOJO): void {
  proj.inputs.forEach((inputDTO) => {
    const config = inputConfigsFromDTO(inputDTO);
    const qualifiedInputId = getQualifiedInputId(
      inputDTO.deviceId,
      inputDTO.id
    );
    InputRegistry.register(qualifiedInputId, config);
    MainWindow.upsertInputConfig(config.toDTO());
  });
}

/**
 * Loads device configurations from the project data.
 * @param proj - The project data object.
 */
function loadDevices(proj: ProjectPOJO): void {
  proj.devices.forEach((deviceDTO) => {
    const deviceConfig = deviceConfigFromDTO(deviceDTO);
    DeviceRegistry.register(deviceDTO.id, deviceConfig);
  });
}

/**
 * Initializes a new default project with no configurations.
 */
export async function initDefault(): Promise<void> {
  currentPath = undefined;

  MainWindow.title = 'Untitled Project';
  MainWindow.edited = false;

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
  app.addRecentDocument(filePath);

  const jsonString = fs.readFileSync(filePath, 'utf8');
  const proj = upgradeProject(jsonString) as ProjectPOJO;

  await loadPlugins(proj);
  loadInputs(proj);
  loadDevices(proj);

  currentPath = filePath;

  MainWindow.title = path.basename(filePath);
  MainWindow.edited = false;

  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();

  MainWindow.setConfiguredDevices(proj.devices);
}

/**
 * Serializes the current project state into an object.
 * @returns The serialized project object.
 */
function serializeProject(): ProjectPOJO {
  return {
    inputs: InputRegistry.getAll().map((input) => input.toDTO()),
    devices: DeviceRegistry.getAll().map((device) => device.toDTO()),
    plugins: PluginRegistry.getAll().map((plugin) => plugin.toDTO()),
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
