import * as Revivable from '../revivable';
import { StatelessPropagator } from './stateless-propagator';

@Revivable.register
export class TogglePropagator extends StatelessPropagator<
  'toggle',
  'toggle' | 'constant'
> {
  constructor(
    or: 'toggle' | 'constant',
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
        this.statusString,
        this.number,
        this.channel,
        this.value,
      ],
    };
  }
}
