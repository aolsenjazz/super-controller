import { StatelessPropagator } from './stateless-propagator';

export class TogglePropagator extends StatelessPropagator<
  'toggle',
  'toggle' | 'constant'
> {
  constructor(
    or: 'toggle' | 'constant',
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber
  ) {
    super('toggle', or, et, n, c, v);
  }
}
