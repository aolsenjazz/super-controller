import { InputResponse } from '../driver-types';
import { Propagator } from './propagator';

/**
 * Propagator that only propagates null
 */
export class NullPropagator extends Propagator {
  #eligibleStates = [];

  #defaultState = 'off';

  #state = 'off';

  constructor(hardwareResponse: InputResponse, outputResponse: InputResponse) {
    super(hardwareResponse, outputResponse, undefined);
  }

  /**
   * Returns null
   *
   * @param _msg The message to respond to
   */
  /* eslint-disable-next-line */
  protected getResponse(_msg: number[]) {
    return undefined;
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
