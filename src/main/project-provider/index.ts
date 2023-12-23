// eslint-disable-next-line max-classes-per-file
import { ipcMain, app, IpcMainEvent, IpcMain } from 'electron';
import Store from 'electron-store';
import path from 'path';
import fs, { stat } from 'fs';

import {
  AdapterDeviceConfig,
  AnonymousDeviceConfig,
  BaseInputConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';
import { parse, stringify } from '@shared/util';
import { getDriver } from '@shared/drivers';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { create } from '@shared/midi-array';

import {
  ADD_DEVICE,
  ADD_TRANSLATOR_OVERRIDE,
  GET_TRANSLATOR_OVERRIDE,
  REMOVE_DEVICE,
  REMOVE_TRANSLATOR_OVERRIDE,
  REQUEST_INPUT_CONFIG,
  REQUEST_OVERRIDES,
  UPDATE_DEVICE,
  UPDATE_INPUT,
} from '../ipc-channels';
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
    this.emit(ProjectProviderEvent.NewProject, 'Untitled Project');
  }

  public loadProject(filePath: string) {
    app.addRecentDocument(filePath);

    this.project = projectFromFile(filePath);

    this.emit(
      ProjectProviderEvent.NewProject,
      path.basename(filePath, '.controller')
    );
  }

  /**
   * Write current project to disk at `project`s default path. If no such default path
   * exists, create a saveAs dialog
   *
   * @returns true if successfully saved
   */
  public async save() {
    if (this.currentPath) {
      fs.writeFileSync(this.currentPath, stringify(this.project), {});
      app.addRecentDocument(this.currentPath);
      return true;
    }

    const result = await dialogs.save(recommendedDir(), 'Untitled project');

    if (result.filePath === undefined) throw new Error('aborted');

    store.set(SAVE_DIR, path.parse(result.filePath).dir);
    this.currentPath = result.filePath;
    return true;
  }

  /**
   * Create a save dialog, update `project` `path` and `name`, write to disk.
   *
   * @returns resolves if project was successfully saved
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
      ADD_DEVICE,
      (
        _e: Event,
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
    ipcMain.on(REMOVE_DEVICE, (_e: Event, deviceId: string) => {
      const config = this.project.getDevice(deviceId);
      this.project.removeDevice(config!);

      this.emit(ProjectProviderEvent.RemoveDevice, this.project);
      MainWindow.sendConfiguredDevices(this.project.devices.map((d) => d.stub));
    });

    ipcMain.on(UPDATE_DEVICE, (_e: Event, updates: ConfigStub) => {
      const config = this.project.getDevice(updates.id)!;

      config.nickname = updates.nickname;
      config.shareSustain = updates.shareSustain;

      this.emit(ProjectProviderEvent.UpdateDevice, this.project);
      MainWindow.sendConfigStub(config.id, config.stub);
    });

    ipcMain.on(
      UPDATE_INPUT,
      (_e: Event, configId: string, inputString: string) => {
        const config = this.project.getDevice(
          configId
        ) as SupportedDeviceConfig;
        const inputConfig = parse<BaseInputConfig>(inputString);

        const inputConfigIdx = config.inputs
          .map((conf, i) => [conf, i] as [BaseInputConfig, number])
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([conf, _i]) => conf.id === inputConfig.id)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(([_conf, i]) => i)[0];

        config.inputs.splice(inputConfigIdx, 1, inputConfig);
        // ps.syncInputLight(configId, inputConfig); TODO: replace with a smart notify

        this.emit(ProjectProviderEvent.UpdateInput, this.project);
      }
    );

    ipcMain.on(
      REMOVE_TRANSLATOR_OVERRIDE,
      (_e: IpcMainEvent, deviceId: string, action: NumberArrayWithStatus) => {
        const conf = this.project.getDevice(deviceId);

        if (conf instanceof AnonymousDeviceConfig) {
          // TODO: is this how we're handling binding keys? this should be formalized either way
          // TODO: also this process should exist as a function on AnonymousDeviceConfigs
          conf.overrides.delete(JSON.stringify(action));
        }
      }
    );

    ipcMain.on(
      ADD_TRANSLATOR_OVERRIDE,
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
      GET_TRANSLATOR_OVERRIDE,
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

    ipcMain.on(REQUEST_OVERRIDES, (_e: IpcMainEvent, deviceId: string) => {
      const conf = this.project.getDevice(deviceId);

      if (conf instanceof AnonymousDeviceConfig) {
        MainWindow.sendOverrides(deviceId, conf.overrides);
      }
    });

    ipcMain.on(
      REQUEST_INPUT_CONFIG,
      (_e: IpcMainEvent, deviceId: string, inputIds: string[]) => {
        const conf = this.project.getDevice(deviceId);

        if (
          conf instanceof SupportedDeviceConfig ||
          conf instanceof AdapterDeviceConfig
        ) {
          const configs = inputIds.map((i) => conf.getInput(i)!.config);
          MainWindow.sendInputConfigs(configs);
        }
      }
    );
  }
}

export const ProjectProvider = ProjectProviderSingleton.getInstance();
export { ProjectProviderEvent };
