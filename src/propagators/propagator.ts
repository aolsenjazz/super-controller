import { MidiValue, MidiMessage } from 'midi-message-parser';

import { isOnMessage } from '../util';

export abstract class Propagator {
  readonly inputResponse: 'gate' | 'toggle' | 'linear' | 'constant';

  outputResponse: 'gate' | 'toggle' | 'linear' | 'constant';

  lastPropagated?: MidiMessage;

  constructor(
    inputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    outputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    lastPropagated?: MidiMessage
  ) {
    this.inputResponse = inputResponse;
    this.outputResponse = outputResponse;
    this.lastPropagated = lastPropagated;
  }

  handleMessage(msg: MidiValue[]) {
    let toPropagate: MidiMessage | null = null;

    switch (this.inputResponse) {
      case 'gate':
        toPropagate = this.#handleAsGate(msg);
        break;
      case 'toggle':
        toPropagate = this.#handleAsToggle(msg);
        break;
      case 'linear':
        toPropagate = this.#handleAsContinuous(msg);
        break;
      case 'constant':
        toPropagate = this.#handleAsConstant(msg);
        break;
      default:
        throw new Error(`unknown inputResponse ${this.inputResponse}`);
    }

    if (toPropagate === null) return toPropagate;

    this.lastPropagated = toPropagate;
    return toPropagate?.toMidiArray();
  }

  #handleAsGate = (msg: MidiValue[]) => {
    // if outputResponse === 'toggle' | 'constant', only respond to 'noteon' messages
    if (this.outputResponse !== 'gate' && !isOnMessage(msg)) return null;

    return this.getResponse(msg);
  };

  #handleAsToggle = (msg: MidiValue[]) => {
    return this.getResponse(msg);
  };

  #handleAsContinuous = (msg: MidiValue[]) => {
    return this.getResponse(msg);
  };

  #handleAsConstant = (msg: MidiValue[]) => {
    return this.getResponse(msg);
  };

  protected abstract getResponse(msg: MidiValue[]): MidiMessage | null;

  abstract get eligibleStates(): string[];

  abstract get defaultState(): string;

  abstract get state(): string;
}
