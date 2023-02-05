import { StatelessPropagator } from './stateless-propagator';
import { CorrelatedResponse } from './propagator';

export class TogglePropagator extends StatelessPropagator {
  constructor(
    or: CorrelatedResponse<'toggle'>,
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber
  ) {
    super('toggle', or, et, n, c, v);
  }
}
