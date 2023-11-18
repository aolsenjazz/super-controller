import { Project } from '@shared/project';
import EventEmitter from 'events';

export enum ProjectProviderEvent {
  NewProject = 'new-project',
  AddDevice = 'add-device',
  RemoveDevice = 'remove-device',
  UpdateDevice = 'update-device',
  UpdateInput = 'update-input',
}

interface ProjectProviderEvents {
  [ProjectProviderEvent.NewProject]: (name: string) => void;
  [ProjectProviderEvent.AddDevice]: (project: Project) => void;
  [ProjectProviderEvent.RemoveDevice]: (project: Project) => void;
  [ProjectProviderEvent.UpdateDevice]: (project: Project) => void;
  [ProjectProviderEvent.UpdateInput]: (project: Project) => void;
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
