import { BasePlugin } from '@plugins/base-plugin';
import { Anonymous, getDriver } from '@shared/drivers';

import { MidiArray } from '../midi-array';
import { KeyboardDriver } from '../driver-types';

export type DeviceConfigStub = {
  id: string;
  portName: string;
  siblingIndex: number;
  driverName: string;
  nickname: string;
  child?: DeviceConfigStub;
};

/**
 * Base interface for SupportedDeviceConfig and AnonymousDeviceConfig.
 */
export abstract class DeviceConfig {
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

  private plugins: BasePlugin[] = [];

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
    this.plugins = plugins;
    this._nickname = nickname;
  }

  /**
   * Adds a plugin to this `DeviceConfig`s `plugins` array at the end of the arr.
   * `plugin` may be an instance of the plugin, or the plugin's id.
   */
  public addPlugin(plugin: BasePlugin) {
    this.plugins.push(plugin);
  }

  /**
   * Removes the plugin from this `DeviceConfig`s `plugins` array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public removePlugin(plugin: BasePlugin | string) {
    const id = plugin instanceof BasePlugin ? plugin.id : plugin;
    const pluginIdx = this.plugins
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((p, _i) => p.id === id)
      .map((_p, i) => i)[0];

    this.plugins.splice(pluginIdx, 1);
  }

  /**
   * Moves the `plugin` to the specified index of the array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public movePlugin(plugin: BasePlugin | string, newIdx: number) {
    const id = plugin instanceof BasePlugin ? plugin.id : plugin;
    const oldIdx = this.plugins
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((p, _i) => p.id === id)
      .map((_p, i) => i)[0];

    const element = this.plugins[oldIdx];
    this.plugins.splice(oldIdx, 1);
    this.plugins.splice(newIdx, 0, element);
  }

  get id() {
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

  public abstract get stub(): DeviceConfigStub;
  public abstract applyOverrides(msg: MidiArray): MidiArray | undefined;
  public abstract getResponse(msg: MidiArray): MidiArray | undefined;
}
