import { StatelessPropagator } from './stateless-propagator';
import { CorrelatedResponse } from './propagator';

export class ContinuousPropagator extends StatelessPropagator {
  constructor(
    or: CorrelatedResponse<'continuous'>,
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber
  ) {
    super('continuous', or, et, n, c, v);
  }
}
