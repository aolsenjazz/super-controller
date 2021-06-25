import { MidiValue } from 'midi-message-parser';

import { Propagator } from './propagator';

/**
 * Propagator that only propagates null
 */
export class NullPropagator extends Propagator {
  constructor(
    inputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    outputResponse: 'gate' | 'toggle' | 'linear' | 'constant'
  ) {
    super(inputResponse, outputResponse, undefined);
  }

  /**
   * Returns null
   *
   * @param { MidiValue[] } _msg The message to respond to
   */
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
