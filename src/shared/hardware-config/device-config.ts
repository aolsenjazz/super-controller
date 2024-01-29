import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';
import { Anonymous, getDriver } from '@shared/drivers';
import { allDevicePlugins } from '@plugins/plugin-utils';
import { Registry } from '@plugins/registry';

import { MidiArray } from '../midi-array';
import { KeyboardDriver } from '../driver-types';
import { InputConfigStub } from './input-config/base-input-config';

export type DeviceConfigStub = {
  id: string;
  portName: string;
  siblingIndex: number;
  driverName: string;
  nickname: string;
  plugins: PluginIcicle[];
  inputs: InputConfigStub[];
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

  private _plugins: BasePlugin[] = [];

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
    this._plugins = plugins;
    this._nickname = nickname;
  }

  /**
   * Adds a plugin to this `DeviceConfig`s `plugins` array at the end of the arr.
   * `plugin` may be an instance of the plugin, or the plugin's id.
   */
  public addPlugin(plugin: BasePlugin) {
    this._plugins.push(plugin);
  }

  /**
   * Removes the plugin from this `DeviceConfig`s `plugins` array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public removePlugin(plugin: BasePlugin | string) {
    const id = plugin instanceof BasePlugin ? plugin.id : plugin;
    const pluginIdx = this._plugins
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((p, _i) => p.id === id)
      .map((_p, i) => i)[0];

    this._plugins.splice(pluginIdx, 1);
  }

  /**
   * Moves the `plugin` to the specified index of the array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public movePlugin(plugin: BasePlugin | string, newIdx: number) {
    const id = plugin instanceof BasePlugin ? plugin.id : plugin;
    const oldIdx = this._plugins
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((p, _i) => p.id === id)
      .map((_p, i) => i)[0];

    const element = this._plugins[oldIdx];
    this._plugins.splice(oldIdx, 1);
    this._plugins.splice(newIdx, 0, element);
  }

  public applyStub(stub: DeviceConfigStub) {
    this.nickname = stub.nickname;

    // take note of what plugins we already have on this device
    const currentPluginIds = this._plugins.map((p) => p.id);
    const newPluginIds = stub.plugins.map((p) => p.id);

    // determine which need to be created + registered/removed + deregistered
    const toAdd = stub.plugins.filter((p) => !currentPluginIds.includes(p.id));
    const toRemove = currentPluginIds.filter(
      (id) => !newPluginIds.includes(id)
    );

    // create, registry, add plugins to config as necessary
    toAdd.forEach((p) => {
      const PluginClass = allDevicePlugins().filter(
        (plugin) => plugin.TITLE() === p.title
      )[0];
      const plugin = new PluginClass();
      Registry.register(plugin);
      this._plugins.push(plugin);
    });

    // deregister and remove as necessary
    toRemove.forEach((p) => Registry.deregister(p));
    this._plugins = this._plugins.filter((p) => !toRemove.includes(p.id));
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

  public get stub(): DeviceConfigStub {
    return {
      id: this.id,
      portName: this.portName,
      driverName: this.driverName,
      nickname: this.nickname,
      siblingIndex: this.siblingIndex,
      inputs: [],
      plugins: this._plugins.map((p) => p.freeze()),
    };
  }

  public abstract applyOverrides(msg: MidiArray): MidiArray | undefined;
  public abstract getResponse(msg: MidiArray): MidiArray | undefined;
}
