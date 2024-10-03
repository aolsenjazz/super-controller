import { app } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs';

import { HardwarePortService } from '@main/port-service';
import { Project } from '@shared/project';
import { DeviceRegistry } from '@main/device-registry';
import { VirtualPortService } from '@main/port-service/virtual/virtual-port-service';

import { dialogs } from '../dialogs';
import { upgradeProject } from '../../helper/project-upgrader';

import { WindowProvider } from '../window-provider';

const { MainWindow } = WindowProvider;

const SAVE_DIR = 'dir';
const store = new Store();

function recommendedDir() {
  return store.get(SAVE_DIR, app.getPath('desktop')) as string;
}

/**
 * Manages state of current project for the backend. Emits whenever the
 * project is updated or changed.
 */
class ProjectProviderSingleton {
  /* The most-recently-used folder path */
  private currentPath?: string;

  private static instance: ProjectProviderSingleton;

  public project: Project = new Project();

  public static getInstance(): ProjectProviderSingleton {
    if (!ProjectProviderSingleton.instance) {
      ProjectProviderSingleton.instance = new ProjectProviderSingleton();
    }
    return ProjectProviderSingleton.instance;
  }

  public async initDefault() {
    this.currentPath = undefined;
    this.project = new Project();

    MainWindow.title = 'Untitle project';
    MainWindow.edited = false;

    const ids = DeviceRegistry.getAll().map((d) => d.id);
    MainWindow.sendConfiguredDevices(ids);
    HardwarePortService.onProjectChange();
    VirtualPortService.onProjectChange();
  }

  public async loadProject(filePath: string) {
    app.addRecentDocument(filePath);

    const jsonString = fs.readFileSync(filePath, 'utf8');
    this.project = upgradeProject(jsonString);
    this.currentPath = filePath;

    HardwarePortService.onProjectChange();
    MainWindow.title = `${filePath}.controller`;
    MainWindow.edited = false;

    const ids = DeviceRegistry.getAll().map((d) => d.id);
    MainWindow.sendConfiguredDevices(ids);
    HardwarePortService.onProjectChange();
    VirtualPortService.onProjectChange();
  }

  /**
   * Write current project to disk at `project`s default path. If no such default path
   * exists, create a saveAs dialog
   */
  public async save() {
    if (this.currentPath === undefined) await this.saveAs();

    const asString = JSON.stringify(this.project.toDTO());
    fs.writeFileSync(this.currentPath!, asString, {});

    app.addRecentDocument(this.currentPath!);
    // TODO: might need to invoke some functions here
    // this.emit(ProjectProviderEvent.Save, {
    //   name: path.basename(this.currentPath!, '.controller'),
    //   project: this.project,
    // });
  }

  /**
   * Create a save dialog, update `project` `path` and `name`, write to disk.
   */
  public async saveAs() {
    const suggestedName = this.currentPath || 'Untitled Project';

    const result = await dialogs.save(recommendedDir(), suggestedName);

    if (result.canceled) throw new Error('aborted');
    if (!result.filePath) throw new Error(`filePath must not be falsy`);

    const { filePath } = result;
    store.set(SAVE_DIR, path.parse(filePath).dir);

    this.currentPath = filePath;
    this.save();
  }

  /**
   * Shows an open dialog to the user, and loads the project at the given URI
   */
  public async open() {
    const result = await dialogs.open(recommendedDir());

    if (result.canceled) throw new Error('aborted');

    const filePath = result.filePaths[0];
    store.set(SAVE_DIR, path.parse(filePath).dir);

    this.loadProject(filePath);
  }
}

export const ProjectProvider = ProjectProviderSingleton.getInstance();
