/* eslint @typescript-eslint/no-empty-interface: 0 */
import { BaseIcicle, Freezable } from '@shared/freezable';
import { MidiArray } from '@shared/midi-array';

type InputType = 'pad' | 'knob' | 'xy' | 'switch' | 'slider' | 'pitchbend';

export interface InputState {}

export interface InputIcicle extends BaseIcicle {
  id: string;
  nickname: string;
  type: InputType;
}

export abstract class BaseInputConfig<T extends InputIcicle = InputIcicle>
  implements Freezable<T>
{
  protected nickname: string = '';

  constructor(nickname: string) {
    this.nickname = nickname;
  }

  protected innerFreeze(): Omit<InputIcicle, 'className'> {
    return {
      id: this.id,
      nickname: this.nickname,
      type: this.type,
    };
  }

  public abstract freeze(): T;

  public applyStub(s: T) {
    this.nickname = s.nickname;
  }

  public abstract get id(): string;

  public abstract get state(): InputState;

  public abstract get type(): InputType;

  /**
   * Returns true if the input this config represents is responsible for generating
   * `msg`. Used to associate message from devices with its config.
   */
  public abstract isOriginator(msg: MidiArray | NumberArrayWithStatus): boolean;

  public abstract handleMessage(msg: MidiArray): MidiArray | undefined;
}
