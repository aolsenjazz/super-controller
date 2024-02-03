import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';

import {
  create,
  MidiArray,
  ThreeByteMidiArray,
  TwoByteMidiArray,
} from '../../midi-array';
import { InputResponse } from '../../driver-types';
import { BaseInputConfig, InputIcicle } from './base-input-config';
import { allInputPlugins } from '@plugins/plugin-utils';
import { Registry } from '@plugins/registry';

export interface MonoInputIcicle<T extends InputDefault = InputDefault>
  extends InputIcicle {
  defaults: T;
  colorCapable: boolean;
  plugins: PluginIcicle[];
}

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly statusString: StatusString | 'noteon/noteoff';

  /* See InputResponse */
  readonly response: InputResponse;
};

export abstract class MonoInputConfig<
  T extends InputDefault = InputDefault,
  K extends MonoInputIcicle = MonoInputIcicle
> extends BaseInputConfig<K> {
  defaults: T;

  protected _plugins: BasePlugin[] = [];

  constructor(nickname: string, plugins: BasePlugin[], defaultVals: T) {
    super(nickname);

    this._plugins = plugins;
    this.defaults = defaultVals;
  }

  public isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    const ma = msg instanceof MidiArray ? msg : create(msg);

    if (ma instanceof TwoByteMidiArray || ma instanceof ThreeByteMidiArray) {
      const noteOnOffMatch =
        this.defaults.statusString === 'noteon/noteoff' &&
        ma.statusString.includes('note');

      return (
        (noteOnOffMatch || ma.statusString === this.defaults.statusString) &&
        ma.channel === this.defaults.channel &&
        ma.number === this.defaults.number
      );
    }

    return this.id === ma.asString(true);
  }

  public applyStub(s: MonoInputIcicle) {
    super.applyStub(s);

    // take note of what plugins we already have on this device
    const currentPluginIds = this._plugins.map((p) => p.id);
    const newPluginIds = s.plugins.map((p) => p.id);

    // determine which need to be created + registered/removed + deregistered
    const toAdd = s.plugins.filter((p) => !currentPluginIds.includes(p.id));
    const toRemove = currentPluginIds.filter(
      (id) => !newPluginIds.includes(id)
    );

    // create, registry, add plugins to config as necessary
    toAdd.forEach((p) => {
      const PluginClass = allInputPlugins().filter(
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

  public innerFreeze() {
    return {
      ...super.innerFreeze(),
      defaults: this.defaults,
      colorCapable: false,
      plugins: this._plugins.map((p) => p.freeze()),
    };
  }

  public handleMessage(msg: MidiArray): MidiArray | undefined {
    // TODO:
    return msg;
  }

  public get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;
    const n = this.defaults.number;

    return `${ss}.${c}.${n}`;
  }

  /**
   * Adds a plugin to this `DeviceConfig`s `plugins` array at the end of the arr.
   * `plugin` may be an instance of the plugin, or the plugin's id.
   *
   * TODO: mayyyybbbeeeeee move _plugins to a PluginChain class so we don't need to reuse add,remove,move logic?
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
}
