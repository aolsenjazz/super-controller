import { ipcMain, app, IpcMainEvent } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs';

import {
  AdapterDeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';

import { CONFIG, INPUT_CONFIG } from '../ipc-channels';
import { dialogs } from '../dialogs';
import {
  ProjectEventEmitter,
  ProjectProviderEvent,
} from './project-event-emitter';
import { upgradeProject } from '../../helper/project-upgrader';

const SAVE_DIR = 'dir';
const store = new Store();

function recommendedDir() {
  return store.get(SAVE_DIR, app.getPath('desktop')) as string;
}

/**
 * Manages state of current project for the backend. Emits whenever the
 * project is updated or changed.
 */
class ProjectProviderSingleton extends ProjectEventEmitter {
  /* The most-recently-used folder path */
  private currentPath?: string;

  private static instance: ProjectProviderSingleton;

  public project: Project = new Project();

  private constructor() {
    super();
    this.initIpc();
  }

  public static getInstance(): ProjectProviderSingleton {
    if (!ProjectProviderSingleton.instance) {
      ProjectProviderSingleton.instance = new ProjectProviderSingleton();
    }
    return ProjectProviderSingleton.instance;
  }

  public async initDefault() {
    this.currentPath = undefined;
    this.project = new Project();
    this.emit(ProjectProviderEvent.NewProject, {
      name: 'Untitled project',
      project: this.project,
    });
  }

  public async loadProject(filePath: string) {
    app.addRecentDocument(filePath);

    const jsonString = fs.readFileSync(filePath, 'utf8');
    this.project = upgradeProject(jsonString);
    this.currentPath = filePath;

    this.emit(ProjectProviderEvent.NewProject, {
      name: path.basename(filePath, '.controller'),
      project: this.project,
    });
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
    this.emit(ProjectProviderEvent.Save, {
      name: path.basename(this.currentPath!, '.controller'),
      project: this.project,
    });
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

  // TODO: soon, this function will be gone
  private initIpc() {
    ipcMain.on(
      INPUT_CONFIG.GET_INPUT_CONFIGS,
      (e: IpcMainEvent, deviceId: string, inputIds: string[]) => {
        const dev = this.project.getDevice(deviceId);

        if (
          dev instanceof SupportedDeviceConfig ||
          dev instanceof AdapterDeviceConfig
        ) {
          e.returnValue = inputIds.map((id) => dev.getInputById(id)!.toDTO());
        } else {
          e.returnValue = [];
        }
      }
    );
  }
}

export const ProjectProvider = ProjectProviderSingleton.getInstance();
export { ProjectProviderEvent };
