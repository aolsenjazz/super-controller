import { BasePlugin } from '../../plugin-core/base-plugin';

import {
  create,
  MidiArray,
  ThreeByteMidiArray,
  TwoByteMidiArray,
} from '../../midi-array';
import type { InputResponse } from '../../driver-types';
import { BaseInputConfig } from './base-input-config';
import { InputPluginChain } from '../../plugin-core/plugin-chain/input-plugin-chain';
import { MonoInputIcicle } from './mono-input-icicle';

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

  protected _plugins: InputPluginChain;

  constructor(nickname: string, plugins: BasePlugin[], defaultVals: T) {
    super(nickname);

    this._plugins = new InputPluginChain(plugins);
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

    this._plugins.reconcile(s.plugins);
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

  public innerFreeze() {
    return {
      ...super.innerFreeze(),
      defaults: this.defaults,
      colorCapable: false,
      plugins: this._plugins.plugins.map((p) => p.toDTO()),
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
}
