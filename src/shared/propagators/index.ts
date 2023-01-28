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
    case 'NStepPropagator':
      return new NStepPropagator(
        obj.hardwareResponse,
        obj.outputResponse,
        new Map<number, number[]>(obj.steps),
        obj.currentStep
      );
    default:
      throw new Error(`unknown propagator type ${obj.type}`);
  }
}
