import { MidiArray } from '@shared/midi-array';

import { generateId } from './plugin-utils';

export interface PluginIcicle {
  id: string;
  title: string;
  on: boolean;
  aggregateCapable: boolean;
}

/**
 * Classes overriding `BasePlugin` live inside the main process and are responsible for their own:
 *
 * - state management
 * - ipc communications
 * - de/serialization
 *
 * Every plugin is stored in a subfolder of the plugins directory, which must have the following
 * file structure:
 *
 * - index.ts: Core plugin logic. Export an object subclassing `BasePlugin`
 * - preload.ts: Contains the IPC service which is injected into the renderer process
 * - gui.tsx: Contains the user interface
 *
 * These files are automatically detected and must adhere to this naming convention.
 * Any number of files may be used, so long as plugin authors keep in mind the different
 * contexts which these files run in.
 */
export abstract class BasePlugin<T extends PluginIcicle = PluginIcicle> {
  public readonly id: string;

  protected on = true;

  constructor() {
    this.id = generateId(this.title());
  }

  public applyIcicle(icicle: T) {
    this.on = icicle.on;
  }

  public freeze(): T {
    return {
      id: this.id,
      title: this.title(),
      on: this.on,
      aggregateCapable: this.aggregateCapable,
    } as T;
  }

  public abstract process(msg: MidiArray | NumberArrayWithStatus): void;
  public abstract get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[];
  public abstract get aggregateCapable(): boolean;

  protected abstract title(): string;
  protected abstract description(): string;
}
