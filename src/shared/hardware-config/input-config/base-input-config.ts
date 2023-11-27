import { MidiArray } from '@shared/midi-array';
import { Skeleton } from '@shared/revivable';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InputState {}

export abstract class BaseInputConfig {
  abstract get nickname(): string;

  abstract set nickname(nickname: string);

  abstract get id(): string;

  abstract get state(): InputState;

  abstract handleMessage(msg: MidiArray): MidiArray | undefined;

  abstract restoreDefaults(): void;

  abstract toJSON(): Skeleton;
}
