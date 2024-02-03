import type { BasePlugin, PluginIcicle } from '@plugins/base-plugin';

import {
  create,
  MidiArray,
  ThreeByteMidiArray,
  TwoByteMidiArray,
} from '../../midi-array';
import { InputResponse } from '../../driver-types';
import { BaseInputConfig, InputIcicle } from './base-input-config';

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

  protected plugins: BasePlugin[] = [];

  constructor(nickname: string, plugins: BasePlugin[], defaultVals: T) {
    super(nickname);

    this.plugins = plugins;
    this.defaults = defaultVals;
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
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

  applyStub(s: MonoInputIcicle) {
    // super.applyStub(s);
    // TODO:
  }

  public innerFreeze() {
    return {
      ...super.innerFreeze(),
      defaults: this.defaults,
      colorCapable: false,
      plugins: this.plugins.map((p) => p.freeze()),
    };
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    // TODO:
    return msg;
  }

  get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;
    const n = this.defaults.number;

    return `${ss}.${c}.${n}`;
  }
}
