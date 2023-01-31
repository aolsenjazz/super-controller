import { MidiArray } from '../midi-array';

import { OutputPropagator } from './output-propagator';
import { Propagator } from './propagator';
import { NStepPropagator } from './n-step-propagator';

export { OutputPropagator, Propagator, NStepPropagator };

export function propagatorFromJSON(json: string) {
  const obj = JSON.parse(json);

  switch (obj.type) {
    case 'OutputPropagator':
      return new OutputPropagator(
        obj.hardwareResponse,
        obj.outputResponse,
        obj.eventType,
        obj.number,
        obj.channel,
        obj.value,
        obj.lastPropagated
      );
    case 'NStepPropagator': {
      const steps = new Map<number, MidiArray | null>();
      obj.steps.forEach((keyVals: [number, MidiArray | null]) => {
        const k = keyVals[0];
        const v = keyVals[1];
        const val = v === null ? null : new MidiArray([v[0], v[1], v[2]]);
        steps.set(k, val);
      });

      return new NStepPropagator(
        obj.hardwareResponse,
        obj.outputResponse,
        steps,
        obj.currentStep
      );
    }

    default:
      throw new Error(`unknown propagator type ${obj.type}`);
  }
}
