/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { MidiArray, create } from '../../midi-array';
import { NonsequentialStepPropagator } from '../../propagators';
import { InputResponse, SwitchDriver } from '../../driver-types';
import { MonoInputConfig } from './mono-input-config';
import { InputState } from './base-input-config';

export interface SwitchState extends InputState {
  step: number;
}

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

  get state() {
    return {
      step: (this.outputPropagator as NonsequentialStepPropagator).lastStep,
    };
  }

  get eligibleResponses() {
    return ['enumerated' as const];
  }

  get eligibleStatusStrings() {
    return [
      'noteon',
      'noteoff',
      'controlchange',
      'programchange',
    ] as StatusString[];
  }

  get response(): InputResponse {
    return this.outputPropagator.outputResponse;
  }
}
