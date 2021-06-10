import { MidiValue } from 'midi-message-parser';

import { Propagator } from './propagator';

export class NullPropagator extends Propagator {
  constructor(
    inputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    outputResponse: 'gate' | 'toggle' | 'linear' | 'constant'
  ) {
    super(inputResponse, outputResponse, undefined);
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
