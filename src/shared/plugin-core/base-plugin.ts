import { generateId } from './plugin-utils';

export interface PluginDTO {
  id: string;
  title: string;
  description: string;
  on: boolean;
}

/**
 * Classes overriding `BasePlugin` live inside the main process and are responsible for their own:
 *
 * - state management
 * - ipc communications
 * - de/serialization
 *
 * Every plugin is stored in a subfolder of the plugins directory, which must contain a manifest.json
 * file, used to identify plugin subcomponents (UI, BasePlugin, IPC).
 *
 * Plugin manifests are dynamically loaded and then used futher to dynamically load subcomponents.
 */
export abstract class BasePlugin<T extends PluginDTO = PluginDTO> {
  public readonly id: string;

  public readonly title: string;

  public readonly description: string;

  public on = true;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
    this.id = generateId(this.title);
  }

  public applyDTO(icicle: T) {
    this.on = icicle.on;
  }

  public toDTO(): T {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      on: this.on,
    } as T;
  }

  public abstract process(msg: NumberArrayWithStatus): void;
  public abstract get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[];
}
