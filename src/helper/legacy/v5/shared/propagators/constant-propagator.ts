import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';

import { StatefulPropagator } from './stateful-propagator';

/**
 * Propagates messages to clients. Responds differently depending on `outputResponse`,
 * and can be set to change response behaviour
 */
@Revivable.register
export class ConstantPropagator extends StatefulPropagator<
  'constant',
  'toggle' | 'constant'
> {
  constructor(
    or: 'toggle' | 'constant',
    et: StatusString | 'noteon/noteoff',
    n: MidiNumber,
    c: Channel,
    v?: MidiNumber,
    s?: StatefulPropagator<'constant', 'constant'>['state'],
  ) {
    super('constant', or, et, n, c, v);

    this.state = s || this.state;
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
        this.state,
      ],
    };
  }

  getResponse(msg: MidiArray) {
    if (this.outputResponse === 'toggle') {
      this.state = this.state === 'on' ? 'off' : 'on';
    }

    return this.handleAsConstant(msg);
  }
}
