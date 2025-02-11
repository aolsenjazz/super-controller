/* eslint @typescript-eslint/no-empty-interface: 0 */
import {
  MessageProcessor,
  MessageProcessorMeta,
} from '../../message-processor';
import { MessageTransport } from '../../message-transport';
import { PluginProvider } from '../../plugin-provider';

import { InputType } from '../../driver-types/input-drivers/base-input-driver';
import { BaseIcicle } from '../../freezable';
import { getQualifiedInputId, inputIdFromDriver } from '../../util';
import { BaseInteractiveInputDriver } from '../../driver-types/input-drivers/base-interactive-input-driver';
import type { BaseInputPlugin } from '../../../plugins/core/base-input-plugin';

export interface InputDTO extends BaseIcicle {
  id: string;
  deviceId: string;
  nickname: string;
  type: InputType;
  plugins: string[];
}

export abstract class BaseInputConfig<
  T extends InputDTO = InputDTO,
  K extends BaseInteractiveInputDriver = BaseInteractiveInputDriver,
> implements MessageProcessor
{
  protected nickname: string = '';

  /**
   * This identifier alone isn't enough to differentiate between configuration object
   * of similar inputs (e.g. noteon/32) on different devices of the same model;
   * use `qualifiedId` to disambiguate
   */
  public id: string;

  public abstract type: InputType;

  readonly deviceId: string;

  readonly driver: K;

  protected plugins: string[];

  constructor(
    deviceId: string,
    nickname: string,
    driver: K,
    plugins: string[],
  ) {
    this.deviceId = deviceId;
    this.nickname = nickname;
    this.driver = driver;
    this.plugins = plugins;

    this.id = inputIdFromDriver(driver);
  }

  public toDTO(): T {
    return {
      deviceId: this.deviceId,
      id: this.id,
      nickname: this.nickname,
      type: this.type,
      plugins: this.plugins,
      className: 'BaseInputConfig',
    } as T;
  }

  public applyStub(s: T) {
    this.nickname = s.nickname;
  }

  public addPlugin(id: string) {
    this.plugins.push(id);
  }

  public removePlugin(pluginId: string) {
    this.plugins = this.plugins.filter((id) => id !== pluginId);
  }

  public async initPluginsFromDTO(
    createPlugin: (
      driver: BaseInteractiveInputDriver,
    ) => Promise<BaseInputPlugin>,
  ) {
    return [await createPlugin(this.driver)];
  }

  /**
   * Identifier for this input config, with appended device ID to differentiate between
   * configs set for different devices of the same model.
   */
  public get qualifiedId() {
    return getQualifiedInputId(this.deviceId, this.id);
  }

  public abstract getPlugins(): string[];

  public abstract init(
    loopbackTransport: MessageTransport,
    pluginProvider: PluginProvider,
  ): void;

  public abstract initDefaultPlugins(provider: PluginProvider): void;

  public abstract process(
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta,
  ): NumberArrayWithStatus | undefined;
}
