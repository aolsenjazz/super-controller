/* eslint @typescript-eslint/no-empty-interface: 0 */
import { InputType } from '@shared/driver-types';
import { BaseIcicle } from '../../freezable';
import { MidiArray } from '../../midi-array';

export interface InputState {}

export interface InputDTO extends BaseIcicle {
  id: string;
  nickname: string;
  type: InputType;
}

export abstract class BaseInputConfig<T extends InputDTO = InputDTO> {
  protected nickname: string = '';

  constructor(nickname: string) {
    this.nickname = nickname;
  }

  public toDTO(): T {
    return {
      id: this.id,
      nickname: this.nickname,
      type: this.type,
      className: 'BaseInputConfig',
    } as T;
  }

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
