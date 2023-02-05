// import { MidiArray } from '../midi-array';

import { InputResponse } from '../driver-types';
import { Propagator, CorrelatedResponse } from './propagator';
import { NStepPropagator } from './n-step-propagator';
import { GatePropagator } from './gate-propagator';
import { OverrideablePropagator } from './overrideable-propagator';
import { ConstantPropagator } from './constant-propagator';
import { PitchbendPropagator } from './pitchbend-propagator';
import { StatelessPropagator } from './stateless-propagator';
import { ContinuousPropagator } from './continuous-propagator';

export {
  Propagator,
  NStepPropagator,
  GatePropagator,
  ConstantPropagator,
  PitchbendPropagator,
  StatelessPropagator,
  OverrideablePropagator,
  ContinuousPropagator,
};

/**
 * Yeah this is ugly af. can't figure out how else to make the compiler stop
 * complaining
 */
export function createPropagator(
  hr: InputResponse,
  or: InputResponse,
  et: StatusString | 'noteon/noteoff',
  n: MidiNumber,
  c: Channel,
  v?: MidiNumber
) {
  switch (hr) {
    case 'gate':
      return new GatePropagator(or as CorrelatedResponse<typeof hr>, et, n, c);
    case 'toggle':
      return new StatelessPropagator(
        hr,
        or as CorrelatedResponse<typeof hr>,
        et,
        n,
        c
      );
    case 'continuous':
      return et === 'pitchbend'
        ? new PitchbendPropagator(or as CorrelatedResponse<typeof hr>, et, n, c)
        : new ContinuousPropagator(
            or as CorrelatedResponse<typeof hr>,
            et,
            n,
            c
          );
    case 'constant':
      return new ConstantPropagator(
        or as CorrelatedResponse<typeof hr>,
        et,
        n,
        c,
        v
      );
    default:
      throw new Error('improper use of createPropagator');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function propagatorFromJSON(obj: any) {
  return createPropagator(
    obj.hardwareResponse,
    obj.outputResponse,
    obj.eventType,
    obj.number,
    obj.channel,
    obj.value
  );
}
