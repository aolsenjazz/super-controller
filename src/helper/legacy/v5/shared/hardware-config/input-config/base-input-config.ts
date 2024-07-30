/* eslint @typescript-eslint/no-empty-interface: 0 */

import { MidiArray } from '../../midi-array';
import { Skeleton } from '../../revivable';

export interface InputState {}

export interface InputConfigStub {
  type: 'pad' | 'knob' | 'xy' | 'switch' | 'slider' | 'pitchbend';
  id: string;
}

export abstract class BaseInputConfig {
  abstract get nickname(): string;

  abstract set nickname(nickname: string);

  abstract get id(): string;

  abstract get state(): InputState;

  abstract get config(): InputConfigStub;

  /**
   * Returns true if the input this config represents is responsible for generating
   * `msg`. Used to associate message from devices with its config.
   */
  abstract isOriginator(msg: MidiArray | NumberArrayWithStatus): boolean;

  abstract applyStub(s: InputConfigStub): void;

  abstract handleMessage(msg: MidiArray): MidiArray | undefined;

  abstract toJSON(): Skeleton;
}
