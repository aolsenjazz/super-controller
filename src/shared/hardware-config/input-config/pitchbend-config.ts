import { create, MidiArray, ThreeByteMidiArray } from '../../midi-array';

import { InputType, MonoInteractiveDriver } from '../../driver-types';
import { MonoInputConfig } from './mono-input-config';
import { SliderState } from './slider-config';

/**
 * It should be noted that while `PitchbendConfig` extends `MonoInputConfig`, pitchbend
 * messages do not have a notion of `number` and therefore `config.number` and
 * `config.defaults.number` are a misnomer. Normally, the value at the number-index of a
 * pitchbend MIDI message array would be the MSB of the pitchbend value, but because of how
 * create configs from drivers, `config.number` is instead just assigned a meaningless number.
 */
export class PitchbendConfig extends MonoInputConfig {
  static fromDriver(d: MonoInteractiveDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    return new PitchbendConfig('', [], def);
  }

  public freeze() {
    return {
      ...this.innerFreeze(),
      className: this.constructor.name,
    };
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    const ma = msg instanceof MidiArray ? msg : create(msg);

    if (ma instanceof ThreeByteMidiArray) {
      return (
        ma.statusString === this.defaults.statusString &&
        ma.channel === this.defaults.channel
      );
    }

    return false;
  }

  get type(): InputType {
    return 'wheel';
  }

  get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;

    return `${ss}.${c}`;
  }

  get state(): SliderState {
    return {
      value: 0, // TODO:
    };
  }
}
