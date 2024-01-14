import { MidiArray } from '@shared/midi-array';
import { generateId } from './plugin-utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PluginIcicle {}

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

  constructor() {
    this.id = generateId(this.title());
  }

  public abstract process(msg: MidiArray | NumberArrayWithStatus): void;
  public abstract freeze(): T;

  protected abstract initIpcListeners(): void;

  public abstract title(): string;
  public abstract description(): string;

  public abstract get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[];
}
