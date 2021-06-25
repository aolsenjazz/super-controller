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

  constructor(
    inputResponse: 'gate' | 'toggle',
    outputResponse: 'gate' | 'toggle' | 'constant',
    onMessage?: MidiMessage,
    offMessage?: MidiMessage,
    lastPropagated?: MidiMessage
  ) {
    super(inputResponse, outputResponse, lastPropagated);

    this.onMessage = onMessage;
    this.offMessage = offMessage;
  }

  /**
   * Returns what message should be sent to the device given its current state
   *
   * @param { MidiValue[] } _msg Not used
   * @return { MidiMessage } this.onMessage || this.offMessage
   */
  /* eslint-disable-next-line */
  protected getResponse(_msg: MidiValue[]) {
    const response = this.#isOnMessage(this.lastPropagated)
      ? this.offMessage
      : this.onMessage;

    return response === undefined || response === null ? null : response;
  }

  /**
   * Returns whether or not mm is equivalent to this propagator's 'on' message
   *
   * @param { MidiMessage | undefined } mm Other message
   * @return { boolean } true if mm === this.onMessage
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
    return ['off', 'on'];
  }

  get defaultState() {
    return 'off';
  }

  get state() {
    return this.#isOnMessage(this.lastPropagated) ? 'on' : 'off';
  }
}
