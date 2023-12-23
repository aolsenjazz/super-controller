/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { MidiArray, create } from '../../midi-array';
import { NonsequentialStepPropagator } from '../../propagators';
import { InputResponse, SwitchDriver } from '../../driver-types';
import { MonoInputConfig } from './mono-input-config';
import { InputConfigStub, InputState } from './base-input-config';

export interface SwitchState extends InputState {
  step: number;
}

export interface SwitchConfigStub extends InputConfigStub {
  states: Map<string, MidiArray>;
}

// TODO: does it really make sense to be extending MonoInputConfig here?
// certainly doesn't "feel" like a mono input config
@Revivable.register
export class SwitchConfig extends MonoInputConfig {
  static fromDriver(d: SwitchDriver) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    const steps = new Map<string, MidiArray>(
      d.steps.map((step) => {
        return [JSON.stringify(step), create(step)];
      })
    );
    const outputPropagator = new NonsequentialStepPropagator(
      d.status,
      d.channel,
      d.number,
      steps,
      d.steps[d.initialStep]
    );

    return new SwitchConfig(def, outputPropagator);
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.defaults, this.outputPropagator, this.nickname],
    };
  }

  restoreDefaults() {
    // TODO: why on earth am I casting this
    (this.outputPropagator as NonsequentialStepPropagator).restoreDefaults();
  }

  get config(): SwitchConfigStub {
    return {
      states: (this.outputPropagator as NonsequentialStepPropagator).steps,
      type: 'switch',
    };
  }

  get state() {
    return {
      step: (this.outputPropagator as NonsequentialStepPropagator).lastStep,
    };
  }

  get response(): InputResponse {
    return this.outputPropagator.outputResponse;
  }
}
