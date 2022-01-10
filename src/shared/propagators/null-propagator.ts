import { MidiValue } from 'midi-message-parser';

import { Propagator } from './propagator';

/**
 * Propagator that only propagates null
 */
export class NullPropagator extends Propagator {
  #eligibleStates = [];

  #defaultState = 'off';

  #state = 'off';

  constructor(
    inputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    outputResponse: 'gate' | 'toggle' | 'linear' | 'constant'
  ) {
    super(inputResponse, outputResponse, undefined);
  }

  /**
   * Returns null
   *
   * @param _msg The message to respond to
   */
  /* eslint-disable-next-line */
  protected getResponse(_msg: MidiValue[]) {
    return null;
  }

  get eligibleStates() {
    return this.#eligibleStates;
  }

  get defaultState() {
    return this.#defaultState;
  }

  get state() {
    return this.#state;
  }
}
