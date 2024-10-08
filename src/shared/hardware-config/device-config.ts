import type { BaseIcicle } from '../freezable';
import { Anonymous, getDriver } from '../drivers';

import type { KeyboardDriver } from '../driver-types';
import { MessageTransport } from '../message-transport';
import { MessageProcessor, MessageProcessorMeta } from '../message-processor';

export interface DeviceConfigDTO extends BaseIcicle {
  id: string;
  portName: string;
  driverName: string;
  siblingIndex: number;
  nickname: string;
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

  /**
   * TODO: this is the only subset of a driver that I'm storing with this config. why.....?
   */
  public keyboardDriver?: KeyboardDriver;

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
  public stub(): Omit<DeviceConfigDTO, 'className'> {
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

  public process(
    msg: NumberArrayWithStatus,
    loopbackTransport: MessageTransport,
    remoteTransport: MessageTransport,
    meta: MessageProcessorMeta
  ) {
    const { pluginProvider } = meta;

    this.plugins.forEach((pluginId) => {
      pluginProvider
        .get(pluginId)
        ?.process(msg, loopbackTransport, remoteTransport, meta);
    });
  }
}
