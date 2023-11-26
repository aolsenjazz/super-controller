import { MidiArray } from '@shared/midi-array';
import { Skeleton } from '@shared/revivable';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseInputStub {}

export abstract class BaseInputConfig {
  abstract get nickname(): string;

  abstract set nickname(nickname: string);

  abstract get id(): string;

  abstract get stub(): BaseInputStub;

  abstract handleMessage(msg: MidiArray): MidiArray | undefined;

  abstract restoreDefaults(): void;

  abstract toJSON(): Skeleton;
}
