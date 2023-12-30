import { BaseInputConfig, DeviceConfig } from '@shared/hardware-config';
import { Project } from '@shared/project';
import EventEmitter from 'events';

export enum ProjectProviderEvent {
  NewProject = 'new-project',
  AddDevice = 'add-device',
  RemoveDevice = 'remove-device',
  UpdateDevice = 'update-device',
  UpdateInput = 'update-input',
}

export type NewProjectEvent = {
  name: string;
  project: Project;
};

interface ProjectProviderEvents {
  [ProjectProviderEvent.NewProject]: (event: NewProjectEvent) => void;
  [ProjectProviderEvent.AddDevice]: (config: DeviceConfig) => void;
  [ProjectProviderEvent.RemoveDevice]: (config: DeviceConfig) => void;
  [ProjectProviderEvent.UpdateDevice]: (project: Project) => void;
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
