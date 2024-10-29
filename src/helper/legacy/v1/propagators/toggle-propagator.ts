import * as Revivable from '../revivable';
import { StatelessPropagator } from './stateless-propagator';
import { CorrelatedResponse } from './propagator';

@Revivable.register
export class TogglePropagator extends StatelessPropagator {
  constructor(
    or: CorrelatedResponse<'toggle'>,
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber,
  ) {
    super('toggle', or, et, n, c, v);
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.outputResponse,
        this.eventType,
        this.number,
        this.channel,
        this.value,
      ],
    };
  }
}
