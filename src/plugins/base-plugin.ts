import { MidiArray } from '@shared/midi-array';

export abstract class BasePlugin<T> {
  public abstract process(msg: MidiArray | NumberArrayWithStatus): void;
  public abstract freeze(): T;

  protected abstract initIpcListeners(): void;

  public abstract get id(): string;
  public abstract get title(): string;
  public abstract get description(): string;

  public abstract get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[];
}
