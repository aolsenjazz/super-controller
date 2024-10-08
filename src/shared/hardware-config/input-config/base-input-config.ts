/* eslint @typescript-eslint/no-empty-interface: 0 */
import {
  MessageProcessor,
  MessageProcessorMeta,
} from '../../message-processor';
import { MessageTransport } from '../../message-transport';
import { PluginProvider } from '../../plugin-provider';

import {
  BaseInputDriver,
  InputType,
} from '../../driver-types/input-drivers/base-input-driver';
import { BaseIcicle } from '../../freezable';

export interface InputState {}

export interface InputDTO extends BaseIcicle {
  id: string;
  deviceId: string;
  nickname: string;
  type: InputType;
}

export abstract class BaseInputConfig<
  T extends InputDTO = InputDTO,
  K extends BaseInputDriver = BaseInputDriver
> implements MessageProcessor
{
  protected nickname: string = '';

  readonly deviceId: string;

  readonly driver: K;

  constructor(deviceId: string, nickname: string, driver: K) {
    this.deviceId = deviceId;
    this.nickname = nickname;
    this.driver = driver;
  }

  public toDTO(): T {
    return {
      deviceId: this.deviceId,
      id: this.id,
      nickname: this.nickname,
      type: this.type,
      className: 'BaseInputConfig',
    } as T;
  }

  public applyStub(s: T) {
    this.nickname = s.nickname;
  }

  public abstract init(
    loopbackTransport: MessageTransport,
    pluginProvider: PluginProvider
  ): void;

  /**
   * Identifier for this input config, determiend by the messages it sends. This identifier
   * alone isn't enough to differentiate between configuration of similar inputs on
   * different, devices of the same model; use `qualifiedId` to disambiguate
   */
  public abstract get id(): string;

  /**
   * Identifier for this input config, with appended device ID to differentiate between
   * configs set for different devices of the same model.
   */
  public abstract get qualifiedId(): string;

  public abstract get state(): InputState;

  public abstract get type(): InputType;

  /**
   * Returns true if the input this config represents is responsible for generating
   * `msg`. Used to associate message from devices with its config.
   */
  public abstract isOriginator(msg: NumberArrayWithStatus): boolean;

  public abstract process(
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined;
}
