import { Propagator } from './propagator';

/**
 * Device `Propagator` that maintain a two-step state: on and off
 */
export class BinaryPropagator extends Propagator {
  /* Message to send to device when state changes to 'on' */
  onMessage?: number[];

  /* Message to send to device when state changes to 'off' */
  offMessage?: number[];

  #eligibleStates = ['on', 'off'];

  #defaultState = 'off';

  constructor(
    hardwareResponse: 'gate' | 'toggle' | 'constant',
    outputResponse: 'gate' | 'toggle',
    onMessage?: number[],
    offMessage?: number[],
    lastPropagated?: number[]
  ) {
    super(hardwareResponse, outputResponse, lastPropagated);

    this.onMessage = onMessage;
    this.offMessage = offMessage;
  }

  /**
   * Returns what message should be sent to the device given its current state
   *
   * @param _msg Not used
   * @returns this.onMessage || this.offMessage
   */
  /* eslint-disable-next-line */
  protected getResponse(_msg: number[]) {
    const isLastPropagatedOn = this.#isOnMessage(this.lastPropagated);
    return isLastPropagatedOn ? this.offMessage : this.onMessage;
  }

  /**
   * Returns whether or not mm is equivalent to this propagator's 'on' message
   *
   * // TODO: can/should we also just compare msg[1]
   *
   * @param mm Other message
   * @returns true if mm === this.onMessage
   */
  #isOnMessage = (msg: number[] | undefined) => {
    if (msg === undefined || this.onMessage === undefined) return false;

    return this.onMessage[0] === msg[0] && this.onMessage[2] === msg[2];
  };

  get eligibleStates() {
    return this.#eligibleStates;
  }

  get defaultState() {
    return this.#defaultState;
  }

  get state() {
    return this.#isOnMessage(this.lastPropagated) ? 'on' : 'off';
  }
}
