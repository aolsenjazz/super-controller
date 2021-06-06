import { MidiValue, MidiMessage } from 'midi-message-parser';

import { Propagator } from './propagator';

export class BinaryPropagator extends Propagator {
  onMessage?: MidiMessage;

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

  get eligibleStates() {
    return ['off', 'on'];
  }

  get defaultState() {
    return 'off';
  }

  get state() {
    return this.#isOnMessage(this.lastPropagated) ? 'on' : 'off';
  }

  /* eslint-disable-next-line */
  protected getResponse(_msg: MidiValue[]) {
    const response = this.#isOnMessage(this.lastPropagated)
      ? this.offMessage
      : this.onMessage;

    return response === undefined || response === null ? null : response;
  }

  #isOnMessage = (mm: MidiMessage | undefined) => {
    if (mm === undefined) return false;

    return (
      mm.channel === this.onMessage?.channel &&
      mm.type === this.onMessage?.type &&
      mm.value === this.onMessage?.value
    );
  };
}
