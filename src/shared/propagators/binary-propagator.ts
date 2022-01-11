import { MidiValue, MidiMessage } from 'midi-message-parser';

import { Propagator } from './propagator';

/**
 * Device `Propagator` that maintain a two-step state: on and off
 */
export class BinaryPropagator extends Propagator {
  /* Message to send to device when state changes to 'on' */
  onMessage?: MidiMessage;

  /* Message to send to device when state changes to 'off' */
  offMessage?: MidiMessage;

  #eligibleStates = ['on', 'off'];

  #defaultState = 'off';

  constructor(
    hardwareResponse: 'gate' | 'toggle' | 'constant',
    outputResponse: 'gate' | 'toggle',
    onMessage?: MidiMessage,
    offMessage?: MidiMessage,
    lastPropagated?: MidiMessage
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
  protected getResponse(_msg: MidiValue[]) {
    const response = this.#isOnMessage(this.lastPropagated)
      ? this.offMessage
      : this.onMessage;

    return response === undefined ? null : response;
  }

  /**
   * Returns whether or not mm is equivalent to this propagator's 'on' message
   *
   * @param mm Other message
   * @returns true if mm === this.onMessage
   */
  #isOnMessage = (mm: MidiMessage | undefined) => {
    if (mm === undefined) return false;

    return (
      mm.channel === this.onMessage?.channel &&
      mm.type === this.onMessage?.type &&
      mm.value === this.onMessage?.value
    );
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
