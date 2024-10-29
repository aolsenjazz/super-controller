/* eslint-disable no-bitwise */
import { create, MidiArray, ThreeByteMidiArray } from '../../midi-array';

import * as Revivable from '../../revivable';
import { PitchbendPropagator } from '../../propagators';
import { InputResponse, MonoInteractiveDriver } from '../../driver-types';
import { MonoInputConfig, MonoInputConfigStub } from './mono-input-config';
import { SliderState } from './slider-config';

/**
 * It should be noted that while `PitchbendConfig` extends `MonoInputConfig`, pitchbend
 * messages do not have a notion of `number` and therefore `config.number` and
 * `config.defaults.number` are a misnomer. Normally, the value at the number-index of a
 * pitchbend MIDI message array would be the MSB of the pitchbend value, but because of how
 * create configs from drivers, `config.number` is instead just assigned a meaningless number.
 */
@Revivable.register
export class PitchbendConfig extends MonoInputConfig {
  static fromDriver(d: MonoInteractiveDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const prop = new PitchbendPropagator(
      'continuous',
      d.status,
      d.number,
      d.channel,
    );

    return new PitchbendConfig(def, prop);
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

  get config(): MonoInputConfigStub {
    return {
      id: this.id,
      defaults: this.defaults,
      colorCapable: false,
      statusString: this.statusString,
      outputResponse: this.response,
      channel: this.channel,
      number: this.number,
      type: 'pitchbend',
    };
  }

  get id() {
    const ss = this.defaults.statusString;
    const c = this.defaults.channel;

    return `${ss}.${c}`;
  }

  get state(): SliderState {
    return {
      value: this.outputPropagator.value,
    };
  }

  get response(): InputResponse {
    return this.outputPropagator.outputResponse;
  }

  set response(response: InputResponse) {
    this.outputPropagator.outputResponse = response;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.defaults, this.outputPropagator, this.nickname],
    };
  }
}
