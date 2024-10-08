import { app } from 'electron';
import Store from 'electron-store';
import path from 'path';
// import fs from 'fs';

// import { DeviceRegistry } from './device-registry';
import { HardwarePortService } from './port-service';
import { VirtualPortService } from './port-service/virtual/virtual-port-service';
import { WindowProvider } from './window-provider';
import { dialogs } from './dialogs';

const { MainWindow } = WindowProvider;

/* The most-recently-used folder path */
let currentPath: string | undefined;

const SAVE_DIR = 'dir';
const store = new Store();

function recommendedDir() {
  return store.get(SAVE_DIR, app.getPath('desktop')) as string;
}

export async function initDefault() {
  currentPath = undefined;

  MainWindow.title = 'Untitle project';
  MainWindow.edited = false;

  // const ids = DeviceRegistry.getAll().map((d) => d.id);
  // MainWindow.sendConfiguredDevice(ids);
  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();
}

export async function loadProject(filePath: string) {
  app.addRecentDocument(filePath);

  // const jsonString = fs.readFileSync(filePath, 'utf8');
  currentPath = filePath;
  // do something with jsonString

  HardwarePortService.onProjectChange();
  MainWindow.title = `${filePath}.controller`;
  MainWindow.edited = false;

  // const ids = DeviceRegistry.getAll().map((d) => d.id);
  // MainWindow.sendConfiguredDevices(ids);
  HardwarePortService.onProjectChange();
  VirtualPortService.onProjectChange();
}

/**
 * Write current project to disk at `project`s default path. If no such default path
 * exists, create a saveAs dialog
 */
export async function save() {
  // if (currentPath === undefined) await saveAs();

  // const asString = JSON.stringify(project.toDTO());
  // fs.writeFileSync(currentPath!, asString, {});

  app.addRecentDocument(currentPath!);
  // TODO: might need to invoke some functions here
  // this.emit(ProjectProviderEvent.Save, {
  //   name: path.basename(this.currentPath!, '.controller'),
  //   project: this.project,
  // });
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
 * Shows an open dialog to the user, and loads the project at the given URI
 */
export async function open() {
  const result = await dialogs.open(recommendedDir());

  if (result.canceled) throw new Error('aborted');

  const filePath = result.filePaths[0];
  store.set(SAVE_DIR, path.parse(filePath).dir);

  loadProject(filePath);
}
