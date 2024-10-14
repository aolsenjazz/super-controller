/* eslint @typescript-eslint/no-empty-interface: 0 */
import {
  MessageProcessor,
  MessageProcessorMeta,
} from '../../message-processor';
import { MessageTransport } from '../../message-transport';
import { PluginProvider } from '../../plugin-provider';

import { InputType } from '../../driver-types/input-drivers/base-input-driver';
import { getQualifiedInputId, inputIdFromDriver } from '../../util';
import {
  InputResponse,
  MonoInteractiveDriver,
} from '../../driver-types/input-drivers/mono-interactive-driver';

/* Default values for the input loaded in from a driver */
export type InputDefaults = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly statusString: StatusString | 'noteon/noteoff';

  /* See InputResponse */
  readonly response: InputResponse;
};

export interface InputDTO<T extends InputDefaults = InputDefaults> {
  defaults: T;
  colorCapable: boolean;
  plugins: string[];
  deviceId: string;
  type: InputType;
  nickname: string;
  id: string;
  className: string;
}

export abstract class BaseInputConfig<
  T extends InputDTO = InputDTO,
  U extends MonoInteractiveDriver = MonoInteractiveDriver,
  V extends InputDefaults = InputDefaults
> implements MessageProcessor
{
  protected nickname: string = '';

  /**
   * This identifier alone isn't enough to differentiate between configuration object
   * of similar inputs (e.g. noteon/32) on different devices of the same model;
   * use `qualifiedId` to disambiguate
   */
  public id: string;

  readonly deviceId: string;

  readonly driver: U;

  public abstract defaults: V;

  public plugins: string[];

  constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: U
  ) {
    this.deviceId = deviceId;
    this.nickname = nickname;
    this.driver = driver;

    this.id = inputIdFromDriver(driver);
    this.plugins = plugins;
  }

  public toDTO() {
    return {
      id: this.id,
      deviceId: this.deviceId,
      nickname: this.nickname,
      type: this.type,
      defaults: this.defaults,
      colorCapable: false,
      plugins: this.plugins,
      className: this.constructor.name,
    };
  }

  public applyStub(s: T) {
    this.nickname = s.nickname;
    this.plugins = s.plugins;
  }

  /**
   * Identifier for this input config, with appended device ID to differentiate between
   * configs set for different devices of the same model.
   */
  public get qualifiedId() {
    return getQualifiedInputId(this.deviceId, this.id);
  }

  public init(
    loopbackTransport: MessageTransport,
    pluginProvider: PluginProvider
  ) {
    this.plugins
      .map((id) => pluginProvider.get(id))
      .forEach((p) => p?.init(loopbackTransport));
  }

  public abstract get type(): InputType;

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    let message = msg;

    for (let i = 0; i < this.plugins.length; i++) {
      const plugin = meta.pluginProvider.get(this.plugins[i]);
      if (plugin && plugin.on === true) {
        const toPropagate = plugin.process(message, meta);
        if (toPropagate === undefined) return undefined;
        message = toPropagate;
      }
    }

    return message;
  }
}
