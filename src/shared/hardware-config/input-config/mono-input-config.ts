import { BasePlugin } from '../../plugin-core/base-plugin';

import {
  create,
  MidiArray,
  ThreeByteMidiArray,
  TwoByteMidiArray,
} from '../../midi-array';
import type { InputResponse } from '../../driver-types';
import { BaseInputConfig } from './base-input-config';
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

  public plugins: string[];

  constructor(nickname: string, plugins: BasePlugin[], defaultVals: T) {
    super(nickname);

    this.plugins = [];
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
  }

  public innerFreeze() {
    return {
      ...super.innerFreeze(),
      defaults: this.defaults,
      colorCapable: false,
      plugins: this.plugins,
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
