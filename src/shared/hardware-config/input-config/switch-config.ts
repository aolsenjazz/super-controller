/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { InputConfig } from './input-config';
import { MidiArray, create } from '../../midi-array';
import { NonsequentialStepPropagator } from '../../propagators';
import { InputResponse, SwitchDriver } from '../../driver-types';

@Revivable.register
export class SwitchConfig extends InputConfig {
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
    (this.outputPropagator as NonsequentialStepPropagator).restoreDefaults();
  }

  get eligibleResponses() {
    return ['constant' as const];
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
