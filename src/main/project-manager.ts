// eslint-disable-next-line max-classes-per-file
import { ipcMain, app } from 'electron';
import { EventEmitter } from 'events';
import path from 'path';

import {
  BaseInputConfig,
  DeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { Project } from '@shared/project';
import { parse } from '@shared/util';

import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
} from './ipc-channels';
import { projectFromFile } from './util-main';

export enum ProjectManagerEvent {
  NewProject = 'new-project',
  AddDevice = 'add-device',
  RemoveDevice = 'remove-device',
  UpdateDevice = 'update-device',
  UpdateInput = 'update-input',
}

interface ProjectManagerEvents {
  [ProjectManagerEvent.NewProject]: (name: string) => void;
  [ProjectManagerEvent.AddDevice]: (project: Project) => void;
  [ProjectManagerEvent.RemoveDevice]: (project: Project) => void;
  [ProjectManagerEvent.UpdateDevice]: (project: Project) => void;
  [ProjectManagerEvent.UpdateInput]: (project: Project) => void;
}

class TypedEventEmitter extends EventEmitter {
  public on<U extends keyof ProjectManagerEvents>(
    event: U,
    listener: ProjectManagerEvents[U]
  ): this {
    super.on(event, listener);
    return this;
  }

  public emit<U extends keyof ProjectManagerEvents>(
    event: U,
    ...args: Parameters<ProjectManagerEvents[U]>
  ): boolean {
    return super.emit(event, ...args);
  }
}

/**
 * Manages state of current project for the backend. Emits whenever the
 * project is updated or changed.
 */
class ProjectManagerSingleton extends TypedEventEmitter {
  private static instance: ProjectManagerSingleton;

  public project: Project = new Project();

  private constructor() {
    super();
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
      const config = parse<DeviceConfig>(c);
      this.project.addDevice(config);

      this.emit(ProjectManagerEvent.AddDevice, this.project);
    });

    /* When a device is removed from project, remove it here and re-init all devices */
    ipcMain.on(REMOVE_DEVICE, (_e: Event, deviceId: string) => {
      const config = this.project.getDevice(deviceId);
      this.project.removeDevice(config!);

      this.emit(ProjectManagerEvent.RemoveDevice, this.project);
    });

    ipcMain.on(UPDATE_DEVICE, (_e: Event, deviceJSON: string) => {
      const config = parse<DeviceConfig>(deviceJSON);

      this.project.removeDevice(config);
      this.project.addDevice(config);

      this.emit(ProjectManagerEvent.UpdateDevice, this.project);
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

        this.emit(ProjectManagerEvent.UpdateInput, this.project);
      }
    );
  }

  public initDefault() {
    this.project = new Project();
    this.emit(ProjectManagerEvent.NewProject, 'Untitled Project');
  }

  public loadProject(filePath: string) {
    app.addRecentDocument(filePath);

    this.project = projectFromFile(filePath);

    this.emit(
      ProjectManagerEvent.NewProject,
      path.basename(filePath, '.controller')
    );
  }
}

export const ProjectManager = ProjectManagerSingleton.getInstance();
