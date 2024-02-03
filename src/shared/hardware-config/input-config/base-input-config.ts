/* eslint @typescript-eslint/no-empty-interface: 0 */

import { MidiArray } from '@shared/midi-array';
import { Skeleton } from '@shared/revivable';

type InputType = 'pad' | 'knob' | 'xy' | 'switch' | 'slider' | 'pitchbend';

export interface InputState {}

export interface InputConfigStub {
  id: string;
  nickname: string;
  type: InputType;
}

export abstract class BaseInputConfig {
  protected nickname: string = '';

  public get config(): InputConfigStub {
    return {
      id: this.id,
      nickname: this.nickname,
      type: this.type,
    };
  }

  public applyStub(s: InputConfigStub) {
    this.nickname = s.nickname;
  }

  abstract get id(): string;

  abstract get state(): InputState;

  abstract get type(): InputType;

  /**
   * Returns true if the input this config represents is responsible for generating
   * `msg`. Used to associate message from devices with its config.
   */
  abstract isOriginator(msg: MidiArray | NumberArrayWithStatus): boolean;

  abstract handleMessage(msg: MidiArray): MidiArray | undefined;

  abstract toJSON(): Skeleton;
}
