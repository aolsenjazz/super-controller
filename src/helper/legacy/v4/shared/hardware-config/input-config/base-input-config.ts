import { MidiArray } from '../../midi-array';
import { Skeleton } from '../../revivable';

export abstract class BaseInputConfig {
  abstract get nickname(): string;

  abstract set nickname(nickname: string);

  abstract get id(): string;

  abstract handleMessage(msg: MidiArray): MidiArray | undefined;

  abstract restoreDefaults(): void;

  abstract toJSON(): Skeleton;
}
