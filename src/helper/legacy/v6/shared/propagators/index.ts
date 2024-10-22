import { InputResponse } from '../driver-types/input-drivers/mono-interactive-driver';
import { Propagator } from './propagator';
import { NStepPropagator } from './n-step-propagator';
import { GatePropagator } from './gate-propagator';
import { OverrideablePropagator } from './overrideable-propagator';
import { ConstantPropagator } from './constant-propagator';
import { PitchbendPropagator } from './pitchbend-propagator';
import { StatelessPropagator } from './stateless-propagator';
import { ContinuousPropagator } from './continuous-propagator';
import { TogglePropagator } from './toggle-propagator';
import { NonsequentialStepPropagator } from './nonsequential-step-propagator';

export {
  Propagator,
  NStepPropagator,
  GatePropagator,
  ConstantPropagator,
  PitchbendPropagator,
  StatelessPropagator,
  OverrideablePropagator,
  ContinuousPropagator,
  NonsequentialStepPropagator,
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
  v?: MidiNumber,
  knobType?: 'endless' | 'absolute',
  valueType?: 'endless' | 'absolute'
) {
  switch (hr) {
    case 'gate':
      return new GatePropagator(or as 'gate' | 'constant' | 'toggle', et, n, c);
    case 'toggle':
      return new TogglePropagator(or as 'toggle' | 'constant', et, n, c);
    case 'continuous':
      return et === 'pitchbend'
        ? new PitchbendPropagator(or as 'continuous', et, n, c)
        : new ContinuousPropagator(
            or as 'continuous' | 'constant',
            et,
            n,
            c,
            v,
            knobType,
            valueType
          );
    case 'constant':
      return new ConstantPropagator(or as 'toggle' | 'constant', et, n, c, v);
    default:
      throw new Error(
        `unable to create propagator: unknown hardwareResponse: ${hr}`
      );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function propagatorFromJSON(obj: any) {
  return createPropagator(
    obj.hardwareResponse,
    obj.outputResponse,
    obj.statusString,
    obj.number,
    obj.channel,
    obj.value,
    obj.knobType,
    obj.valueType
  );
}
