import {
  BaseInputConfig,
  DeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';
import { parse } from '@shared/util';
import { ipcMain } from 'electron';
import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
} from './ipc-channels';
import { WindowService as ws } from './window-service';

type ProjectUpdateListener = (project: Project) => void;

/**
 * Manages state of current project for the backend. Notifies listeners whenever the
 * project is updated or changed.
 */
class ProjectManagerSingleton {
  private static instance: ProjectManagerSingleton;

  private project: Project = new Project();

  private listeners: ProjectUpdateListener[] = [];

  private constructor() {
    this.initIpc();
  }

  public static getInstance(): ProjectManagerSingleton {
    if (!ProjectManagerSingleton.instance) {
      ProjectManagerSingleton.instance = new ProjectManagerSingleton();
    }
    return ProjectManagerSingleton.instance;
  }

  private initIpc() {
    ipcMain.on(ADD_DEVICE, (_e: Event, c: string) => {
      ws.setEdited(true);

      const config = parse<DeviceConfig>(c);
      this.project.addDevice(config);

      this.notifyListeners();
    });

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(REMOVE_DEVICE, (_e: Event, deviceId: string) => {
      ws.setEdited(true);

      const config = this.project.getDevice(deviceId);

      if (!config) throw new Error(`no config exists for device ${deviceId}`);

      this.project.removeDevice(config);

      this.notifyListeners();
    });

    ipcMain.on(UPDATE_DEVICE, (_e: Event, deviceJSON: string) => {
      ws.setEdited(true);

      const config = parse<DeviceConfig>(deviceJSON);

      this.project.removeDevice(config);
      this.project.addDevice(config);

      this.notifyListeners();
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
        ws.setEdited(true);
      }
    );
  }

  public initDefault() {
    this.project = new Project();
    this.notifyListeners();
  }

  public setProject(project: Project) {
    this.project = project;
    this.notifyListeners();
  }

  public getProject(): Project {
    return this.project;
  }

  public subscribe(listener: ProjectUpdateListener) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: ProjectUpdateListener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.project));
  }
}

export const ProjectManager = ProjectManagerSingleton.getInstance();
