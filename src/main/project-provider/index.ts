import { ipcMain, app, IpcMainEvent } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs from 'fs';

import {
  AdapterDeviceConfig,
  AnonymousDeviceConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';
import { idForConfigStub, stringify } from '@shared/util';
import { getDriver } from '@shared/drivers';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { create } from '@shared/midi-array';
import {
  BaseInputConfig,
  InputConfigStub,
} from '@shared/hardware-config/input-config/base-input-config';

import { CONFIG, TRANSLATOR } from '../ipc-channels';
import { projectFromFile } from '../util-main';
import { dialogs } from '../dialogs';
import {
  ProjectEventEmitter,
  ProjectProviderEvent,
} from './project-event-emitter';
import { wp } from '../window-provider';

const { MainWindow } = wp;

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

  public initDefault() {
    this.project = new Project();
    this.emit(ProjectProviderEvent.NewProject, {
      name: 'Untitled project',
      project: this.project,
    });
  }

  public loadProject(filePath: string) {
    app.addRecentDocument(filePath);

    this.project = projectFromFile(filePath);

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
    if (this.currentPath) {
      fs.writeFileSync(this.currentPath, stringify(this.project), {});
      app.addRecentDocument(this.currentPath);
    }

    const result = await dialogs.save(recommendedDir(), 'Untitled project');

    if (result.filePath === undefined) throw new Error('aborted');

    store.set(SAVE_DIR, path.parse(result.filePath).dir);
    this.currentPath = result.filePath;
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
    this.currentPath = filePath;

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
        const driver = getDriver(driverName || deviceName);
        const conf = configFromDriver(deviceName, siblingIdx, driver);

        if (conf instanceof AdapterDeviceConfig) {
          const childDriver = getDriver(childName!);
          const childConf = configFromDriver(
            childName!,
            siblingIdx,
            childDriver
          );
          conf.setChild(childConf as SupportedDeviceConfig);
        }

        this.project.addDevice(conf);

        this.emit(ProjectProviderEvent.AddDevice, conf);
        MainWindow.sendConfiguredDevices(
          this.project.devices.map((d) => d.stub)
        );
      }
    );

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(CONFIG.REMOVE_DEVICE, (_e: IpcMainEvent, deviceId: string) => {
      const config = this.project.getDevice(deviceId)!;
      this.project.removeDevice(config);

      this.emit(ProjectProviderEvent.RemoveDevice, config);
      MainWindow.sendConfiguredDevices(this.project.devices.map((d) => d.stub));
    });

    ipcMain.on(
      CONFIG.UPDATE_DEVICE,
      (_e: IpcMainEvent, updates: ConfigStub) => {
        const config = this.project.getDevice(updates.id)!;

        config.nickname = updates.nickname;
        config.shareSustain = updates.shareSustain;

        this.emit(ProjectProviderEvent.UpdateDevice, this.project);
        MainWindow.sendConfigStub(config.id, config.stub);
      }
    );

    ipcMain.on(
      CONFIG.UPDATE_INPUT,
      (_e: IpcMainEvent, deviceId: string, configs: InputConfigStub[]) => {
        const deviceConfig = this.project.getDevice(
          deviceId
        ) as SupportedDeviceConfig;

        const updatedConfigs: BaseInputConfig[] = [];
        configs.forEach((c) => {
          const id = idForConfigStub(c);
          const input = deviceConfig.getInputById(id);

          if (input) {
            input.applyStub(c);
            updatedConfigs.push(input);
            MainWindow.sendInputState(deviceId, id, input.state);
          }
        });

        MainWindow.sendInputConfigs(updatedConfigs.map((c) => c.config));
        this.emit(
          ProjectProviderEvent.UpdateInput,
          deviceConfig,
          updatedConfigs
        );
      }
    );

    ipcMain.on(
      TRANSLATOR.REMOVE_TRANSLATOR_OVERRIDE,
      (_e: IpcMainEvent, deviceId: string, action: NumberArrayWithStatus) => {
        const conf = this.project.getDevice(deviceId);

        if (conf instanceof AnonymousDeviceConfig) {
          conf.deleteOverride(action);
        }
      }
    );

    ipcMain.on(
      TRANSLATOR.ADD_TRANSLATOR_OVERRIDE,
      (
        _e: IpcMainEvent,
        deviceId: string,
        action: NumberArrayWithStatus,
        statusString: StatusString,
        channel: Channel,
        number: MidiNumber,
        value: MidiNumber
      ) => {
        const conf = this.project.getDevice(deviceId);

        if (conf instanceof AnonymousDeviceConfig) {
          const ma = create(action);
          conf.overrideInput(ma, statusString, channel, number, value);

          MainWindow.sendOverrides(deviceId, conf.overrides);
        }
      }
    );

    ipcMain.on(
      TRANSLATOR.GET_TRANSLATOR_OVERRIDE,
      (e: IpcMainEvent, deviceId: string, action: NumberArrayWithStatus) => {
        const conf = this.project.getDevice(deviceId);

        if (conf instanceof AnonymousDeviceConfig) {
          const ma = create(action);
          e.returnValue = conf.getOverride(ma);
        } else {
          e.returnValue = undefined;
        }
      }
    );

    ipcMain.on(
      TRANSLATOR.REQUEST_OVERRIDES,
      (_e: IpcMainEvent, deviceId: string) => {
        const conf = this.project.getDevice(deviceId);

        if (conf instanceof AnonymousDeviceConfig) {
          MainWindow.sendOverrides(deviceId, conf.overrides);
        }
      }
    );

    ipcMain.on(
      CONFIG.REQUEST_INPUT_CONFIG_STUB,
      (_e: IpcMainEvent, deviceId: string, inputIds: string[]) => {
        const conf = this.project.getDevice(deviceId);

        if (
          conf instanceof SupportedDeviceConfig ||
          conf instanceof AdapterDeviceConfig
        ) {
          const configs = inputIds.map((i) => conf.getInputById(i)!.config);
          MainWindow.sendInputConfigs(configs);
        }
      }
    );
  }
}

export const ProjectProvider = ProjectProviderSingleton.getInstance();
export { ProjectProviderEvent };
