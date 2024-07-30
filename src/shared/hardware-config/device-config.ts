import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';

import { BaseIcicle, Freezable } from '../freezable';
import { Anonymous, getDriver } from '../drivers';

import { MidiArray } from '../midi-array';
import { KeyboardDriver } from '../driver-types';
import { DevicePluginChain } from './plugin-chain/device-plugin-chain';

export interface DeviceIcicle extends BaseIcicle {
  id: string;
  portName: string;
  driverName: string;
  siblingIndex: number;
  nickname: string;
  plugins: PluginIcicle[];
  child?: DeviceIcicle;
}

/**
 * Base interface for SupportedDeviceConfig and AnonymousDeviceConfig.
 */
export abstract class DeviceConfig<T extends DeviceIcicle = DeviceIcicle>
  implements Freezable<T>
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

  private _plugins: DevicePluginChain;

  constructor(
    portName: string,
    driverName: string,
    siblingIndex: number,
    nickname?: string,
    plugins: BasePlugin[] = []
  ) {
    this.portName = portName;
    this.driverName = driverName;
    this.siblingIndex = siblingIndex;
    this._plugins = new DevicePluginChain(plugins);
    this._nickname = nickname;
  }

  public applyStub(stub: DeviceIcicle) {
    this.nickname = stub.nickname;

    this._plugins.reconcile(stub.plugins);
  }

  /**
   * Adds a plugin to this `DeviceConfig`s `plugins` array at the end of the arr.
   * `plugin` may be an instance of the plugin, or the plugin's id.
   */
  public addPlugin(plugin: BasePlugin) {
    this._plugins.addPlugin(plugin);
  }

  /**
   * Removes the plugin from this `DeviceConfig`s `plugins` array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public removePlugin(plugin: BasePlugin | string) {
    this._plugins.removePlugin(plugin);
  }

  /**
   * Moves the `plugin` to the specified index of the array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public movePlugin(plugin: BasePlugin | string, newIdx: number) {
    this._plugins.movePlugin(plugin, newIdx);
  }

  public get id() {
    return `${this.portName} ${this.siblingIndex}`;
  }

  public get plugins(): ReadonlyArray<BasePlugin> {
    return this.plugins;
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
  public stub(): Omit<DeviceIcicle, 'className'> {
    return {
      id: this.id,
      portName: this.portName,
      driverName: this.driverName,
      nickname: this.nickname,
      siblingIndex: this.siblingIndex,
      plugins: this._plugins.plugins.map((p) => p.freeze()),
    };
  }

  public abstract freeze(): T;
  public abstract applyOverrides(msg: MidiArray): MidiArray | undefined;
  public abstract getResponse(msg: MidiArray): MidiArray | undefined;
}
