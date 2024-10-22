import { PluginProvider } from '../plugin-provider';

import type { BaseIcicle } from '../freezable';
import { Anonymous, getDriver } from '../drivers';

import { MessageProcessor, MessageProcessorMeta } from '../message-processor';
import { MessageTransport } from '../message-transport';
import { InputProvider } from '@shared/input-provider';

export interface DeviceConfigDTO extends BaseIcicle {
  id: string;
  portName: string;
  driverName: string;
  siblingIndex: number;
  nickname: string;
  type: 'adapter' | 'supported' | 'anonymous';
  plugins: string[];
  child?: DeviceConfigDTO;
}

/**
 * Base interface for SupportedDeviceConfig and AnonymousDeviceConfig.
 */
export abstract class DeviceConfig<T extends DeviceConfigDTO = DeviceConfigDTO>
  implements MessageProcessor
{
  /**
   * MIDI-driver-reported name. E.g. for Launchkey Mini MK3:
   *
   * OSX: Launchkey Mini MK3 MIDI
   * Linux: Launchkey Mini MK3:Launchkey Mini MK3 Launchkey Mi 20:0
   *
   * Used to bind this config to the given port.
   *
   */
  public readonly portName: string;

  /**
   * Name of the driver to bind this config to. E.g. APC Key 25 | iRig BlueBoard. The value
   * of this field should match the name field of one of the driver files in src/shared/drivers
   */
  public readonly driverName: string;

  /* nth-occurence of this device. applicable if > 1 device of same model is connected/configured */
  public readonly siblingIndex: number;

  /* User-defined nickname */
  private _nickname?: string;

  public plugins: string[];

  constructor(
    portName: string,
    driverName: string,
    siblingIndex: number,
    nickname?: string,
    plugins: string[] = []
  ) {
    this.portName = portName;
    this.driverName = driverName;
    this.siblingIndex = siblingIndex;
    this.plugins = plugins;
    this._nickname = nickname;
  }

  public applyStub(stub: DeviceConfigDTO) {
    this.nickname = stub.nickname;
  }

  public init(
    loopbackTransport: MessageTransport,
    pluginProvider: PluginProvider,
    _inputProvider: InputProvider
  ) {
    this.plugins
      .map((id) => pluginProvider.get(id))
      .forEach((p) => p!.init(loopbackTransport));
  }

  public get id() {
    return `${this.portName} ${this.siblingIndex}`;
  }

  /**
   * TODO: is this really how I want to implement this?
   */
  public get nickname() {
    return this._nickname !== undefined ? this._nickname : this.portName;
  }

  public set nickname(nickname: string) {
    this._nickname = nickname;
  }

  public get driver() {
    return getDriver(this.driverName) || Anonymous;
  }

  /**
   * Similar to `freeze()` except it doesn't recurse though children, significantly
   * reducing serialized size and processing speed.
   */
  public stub(): Omit<DeviceConfigDTO, 'className' | 'type'> {
    return {
      id: this.id,
      portName: this.portName,
      driverName: this.driverName,
      nickname: this.nickname,
      siblingIndex: this.siblingIndex,
      plugins: this.plugins,
    };
  }

  public abstract toDTO(): T;

  /**
   * Processes a MIDI message through a series of plugins, updating the message as it
   * passes through each plugin in sequence. If any plugin returns `undefined`, processing
   * will be short-circuited, and `undefined` will be returned.
   *
   * @param {NumberArrayWithStatus} msg - The original MIDI message
   * @param {MessageProcessorMeta} meta - Metadata required for processing, including transports and plugin providers.
   */
  public process(
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined {
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
