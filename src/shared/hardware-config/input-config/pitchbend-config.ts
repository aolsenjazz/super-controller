/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { PitchbendPropagator } from '../../propagators';
import { InputResponse, MonoInteractiveDriver } from '../../driver-types';
import { InputState } from './base-input-config';
import { MonoInputConfig, MonoInputConfigStub } from './mono-input-config';

export interface PitchbendState extends InputState {
  value: MidiNumber;
}

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
      d.channel
    );

    return new PitchbendConfig(def, prop);
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

  get state(): PitchbendState {
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
