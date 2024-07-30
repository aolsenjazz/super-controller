/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { MonoInputConfig, MonoInputConfigStub } from './mono-input-config';
import { InputResponse, InputDriverWithHandle } from '../../driver-types';
import { ContinuousPropagator } from '../../propagators';
import { InputState } from './base-input-config';

export interface SliderState extends InputState {
  value: MidiNumber;
}

@Revivable.register
export class SliderConfig extends MonoInputConfig {
  static fromDriver(d: InputDriverWithHandle) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const prop = new ContinuousPropagator(
      'continuous',
      d.status,
      d.number,
      d.channel
    );

    return new SliderConfig(def, prop);
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.defaults, this.outputPropagator, this.nickname],
    };
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
      type: 'slider',
    };
  }

  get state() {
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
}
