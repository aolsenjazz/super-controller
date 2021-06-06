import { MidiValue } from 'midi-message-parser';

import { Propagator } from './propagator';

export class NullPropagator extends Propagator {
  constructor() {
    super('gate', 'gate', undefined);
  }

  /* eslint-disable-next-line */
  protected getResponse(_msg: MidiValue[]) {
    return null;
  }

  get eligibleStates() {
    return [];
  }

  get defaultState() {
    return 'off';
  }

  get state() {
    return 'off';
  }
}
