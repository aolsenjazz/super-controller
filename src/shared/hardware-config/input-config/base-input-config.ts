/* eslint @typescript-eslint/no-empty-interface: 0 */

import { MidiArray } from '@shared/midi-array';
import { Skeleton } from '@shared/revivable';

export interface InputState {}

export interface InputConfigStub {
  type: 'pad' | 'knob' | 'xy' | 'switch' | 'slider' | 'pitchbend';
}

export abstract class BaseInputConfig {
  abstract get nickname(): string;

  abstract set nickname(nickname: string);

  abstract get id(): string;

  abstract get state(): InputState;

  abstract get config(): InputConfigStub;

  abstract applyStub(s: InputConfigStub): void;

  abstract handleMessage(msg: MidiArray): MidiArray | undefined;

  abstract restoreDefaults(): void;

  abstract toJSON(): Skeleton;
}
