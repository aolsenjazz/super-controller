/* eslint-disable no-bitwise */
import * as Revivable from '../../revivable';
import { InputConfig } from './input-config';
import { InputResponse, InputDriverWithHandle } from '../../driver-types';
import { ContinuousPropagator } from '../../propagators';

@Revivable.register
export class SliderConfig extends InputConfig {
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

  get eligibleResponses() {
    return ['continuous', 'constant'] as InputResponse[];
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

  set response(response: InputResponse) {
    this.outputPropagator.outputResponse = response;
  }
}
