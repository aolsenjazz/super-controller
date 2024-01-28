import { ipcMain, app, IpcMainEvent } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs';

import {
  AdapterDeviceConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';
import { stringify } from '@shared/util';
import { Anonymous, getDriver } from '@shared/drivers';
import { DeviceConfigStub } from '@shared/hardware-config/device-config';

import { CONFIG } from '../ipc-channels';
import { dialogs } from '../dialogs';
import {
  ProjectEventEmitter,
  ProjectProviderEvent,
} from './project-event-emitter';
import { upgradeProject } from 'helper/project-upgrader';

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

    fs.writeFileSync(this.currentPath!, stringify(this.project), {});

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

  private initIpc() {
    ipcMain.on(
      CONFIG.ADD_DEVICE,
      (
        _e: IpcMainEvent,
        deviceName: string,
        siblingIdx: number,
        driverName?: string,
        childName?: string
      ) => {
        const driver = getDriver(driverName || deviceName) || Anonymous;
        const conf = configFromDriver(deviceName, siblingIdx, driver);

        if (conf instanceof AdapterDeviceConfig) {
          if (childName === undefined)
            throw new Error('must provide child name');

          const childDriver = getDriver(childName)!;
          const childConf = configFromDriver(
            childName!,
            siblingIdx,
            childDriver
          );
          conf.setChild(childConf as SupportedDeviceConfig);
        }

        this.project.addDevice(conf);

        this.emit(ProjectProviderEvent.DevicesChanged, {
          changed: [conf],
          project: this.project,
          action: 'add',
        });
      }
    );

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(CONFIG.REMOVE_DEVICE, (_e: IpcMainEvent, deviceId: string) => {
      const config = this.project.getDevice(deviceId)!;
      this.project.removeDevice(config);

      this.emit(ProjectProviderEvent.DevicesChanged, {
        changed: [config],
        project: this.project,
        action: 'remove',
      });
    });

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(CONFIG.GET_CONFIGURED_DEVICES, (e: IpcMainEvent) => {
      e.returnValue = this.project.devices.map((d) => d.stub);
    });

    ipcMain.on(
      CONFIG.UPDATE_DEVICE,
      (_e: IpcMainEvent, updates: DeviceConfigStub) => {
        const config = this.project.getDevice(updates.id)!;

        config.nickname = updates.nickname;

        this.emit(ProjectProviderEvent.DevicesChanged, {
          changed: [config],
          project: this.project,
          action: 'update',
        });
      }
    );
  }
}

export const ProjectProvider = ProjectProviderSingleton.getInstance();
export { ProjectProviderEvent };
