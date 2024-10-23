import { app } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs';

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

/* The most-recently-used folder path */
let currentPath: string | undefined;

const SAVE_DIR = 'dir';
const store = new Store();

function recommendedDir() {
  return store.get(SAVE_DIR, app.getPath('desktop')) as string;
}

export async function initDefault() {
  currentPath = undefined;

  MainWindow.title = 'Untitled project';
  MainWindow.edited = false;

  MainWindow.setConfiguredDevices([]);
  MainWindow.setInputConfigs([]);
  MainWindow.setPlugins([]);

  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();
}

export async function loadProject(filePath: string) {
  app.addRecentDocument(filePath);

  const jsonString = fs.readFileSync(filePath, 'utf8');
  const proj = upgradeProject(jsonString) as ProjectPOJO;

  for (let i = 0; i < proj.plugins.length; i++) {
    // TODO: properly deal with this later
    // eslint-disable-next-line no-await-in-loop
    const plugin = await createPluginFromDTO(proj.plugins[i]);
    PluginRegistry.register(plugin.id, plugin);

    MainWindow.upsertPlugin(plugin.toDTO());
  }

  proj.inputs.forEach((i) => {
    const config = inputConfigsFromDTO(i);
    InputRegistry.register(getQualifiedInputId(i.deviceId, i.id), config);
    MainWindow.upsertInputConfig(config.toDTO());
  });

  proj.devices.forEach((d) => {
    DeviceRegistry.register(d.id, deviceConfigFromDTO(d));
  });

  currentPath = filePath;

  MainWindow.title = `${filePath}.controller`;
  MainWindow.edited = false;

  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();

  MainWindow.setConfiguredDevices(proj.devices);
}

/**
 * Create a save dialog, update `project` `path` and `name`, write to disk.
 */
export async function saveAs() {
  const suggestedName = currentPath || 'Untitled Project';

  const result = await dialogs.save(recommendedDir(), suggestedName);

  if (result.canceled) throw new Error('aborted');
  if (!result.filePath) throw new Error(`filePath must not be falsy`);

  const { filePath } = result;
  store.set(SAVE_DIR, path.parse(filePath).dir);

  currentPath = filePath;
  save();
}

/**
 * Write current project to disk at `project`s default path. If no such default path
 * exists, create a saveAs dialog
 */
export async function save() {
  if (currentPath === undefined) await saveAs();

  const projectObject = {
    inputs: InputRegistry.getAll().map((i) => i.toDTO()),
    devices: DeviceRegistry.getAll().map((d) => d.toDTO()),
    plugins: PluginRegistry.getAll().map((p) => p.toDTO()),
    version: CURRENT_VERSION,
  };

  fs.writeFileSync(currentPath!, JSON.stringify(projectObject), {});

  app.addRecentDocument(currentPath!);
}

/**
 * Shows an open dialog to the user, and loads the project at the given URI
 */
export async function open() {
  const result = await dialogs.open(recommendedDir());

  if (result.canceled) throw new Error('aborted');

  const filePath = result.filePaths[0];
  store.set(SAVE_DIR, path.parse(filePath).dir);

  loadProject(filePath);
}
