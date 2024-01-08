import { BaseInputConfig, DeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import EventEmitter from 'events';

export enum ProjectProviderEvent {
  NewProject = 'new-project',
  DevicesChanged = 'devices-changed',
  UpdateDevice = 'update-device',
  UpdateInput = 'update-input',
  Save = 'save',
}

export type ProjectChangedEvent = {
  name: string;
  project: Project;
};

export type DevicesChangedEvent = {
  changed: DeviceConfig[];
  project: Project;
  action: 'remove' | 'add' | 'update';
};

interface ProjectProviderEvents {
  [ProjectProviderEvent.NewProject]: (event: ProjectChangedEvent) => void;
  [ProjectProviderEvent.Save]: (event: ProjectChangedEvent) => void;
  [ProjectProviderEvent.DevicesChanged]: (event: DevicesChangedEvent) => void;
  [ProjectProviderEvent.UpdateDevice]: (event: DevicesChangedEvent) => void;
  [ProjectProviderEvent.UpdateInput]: (
    deviceConfig: DeviceConfig,
    inputConfigs: BaseInputConfig[]
  ) => void;
}

export class ProjectEventEmitter extends EventEmitter {
  public on<U extends keyof ProjectProviderEvents>(
    event: U,
    listener: ProjectProviderEvents[U]
  ): this {
    super.on(event, listener);
    return this;
  }

  public emit<U extends keyof ProjectProviderEvents>(
    event: U,
    ...args: Parameters<ProjectProviderEvents[U]>
  ): boolean {
    return super.emit(event, ...args);
  }
}
