/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { SliderConfig } from './slider-config';
import { PitchbendPropagator } from '../../propagators';
import { MonoInteractiveDriver } from '../../driver-types';
import { InputState } from './base-input-config';
import { MonoInputConfigStub } from './mono-input-config';

export interface PitchbendState extends InputState {
  value: MidiNumber;
}

@Revivable.register
export class PitchbendConfig extends SliderConfig {
  // TODO: not immediate, but pitchbend events don't have a notion of `number`.
  // for correctness' sake, change this
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
      defaults: this.defaults,
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
}
