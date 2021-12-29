import { MidiValue, MidiMessage } from 'midi-message-parser';

import { isOnMessage } from '../util';

/**
 * Manages propagation of messages to devices and clients. Can be set to propagate
 * message different by setting `outputResponse`
 */
export abstract class Propagator {
  /**
   * Describes how the hardware input response to touch events
   *
   * gate: event fired on press and release
   * toggle: event fired on press
   * linear: continuous input (TODO: should probably be renamed to 'continuous')
   * constant: event fired on press, always the same event
   */
  readonly inputResponse: 'gate' | 'toggle' | 'linear' | 'constant';

  /**
   * Describes how event are propagated to clients. Not all inputs are eligible for
   * all responses; inputs who hardware response is 'toggle' can only propagate in
   * 'toggle' or 'constant' mode, because no events are fired from hardware on input release
   *
   * gate: event fired on press and release
   * toggle: event fired on press
   * linear: continuous input (TODO: should probably be renamed to 'continuous')
   * constant: event fired on press, always the same event
   */
  outputResponse: 'gate' | 'toggle' | 'linear' | 'constant';

  /* The last-propagated message */
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

  /**
   * Returns different messages to propgate depending on `this.outputResponse`
   * and `this.lastPropagated`.
   *
   * @param { MidiValue[] } msg Message from device to respond to
   * @return { MidiValue[] } The message to propagate
   */
  handleMessage(msg: MidiValue[]) {
    let toPropagate: MidiMessage | null = null;

    switch (this.inputResponse) {
      case 'gate':
        toPropagate = this.#handleInputAsGate(msg);
        break;
      case 'toggle':
        toPropagate = this.#handleInputAsToggle(msg);
        break;
      case 'linear':
        toPropagate = this.#handleInputAsContinuous(msg);
        break;
      case 'constant':
        toPropagate = this.#handleInputAsConstant(msg);
        break;
      default:
        throw new Error(`unknown inputResponse ${this.inputResponse}`);
    }

    if (toPropagate === null) return toPropagate;

    this.lastPropagated = toPropagate;
    return toPropagate?.toMidiArray();
  }

  /**
   * Returns the message to propagate if inputResponse is gate
   *
   * @param { MidiValue[] } msg The message from device
   * @return { MidiMessage } the message to propagate
   */
  #handleInputAsGate = (msg: MidiValue[]) => {
    // if outputResponse === 'toggle' | 'constant', only respond to 'noteon' messages
    if (this.outputResponse !== 'gate' && !isOnMessage(msg)) return null;

    return this.getResponse(msg);
  };

  /**
   * Returns the message to propagate if inputResponse is toggle
   *
   * @param { MidiValue[] } msg The message from device
   * @return { MidiMessage } the message to propagate
   */
  #handleInputAsToggle = (msg: MidiValue[]) => {
    return this.getResponse(msg);
  };

  /**
   * Returns the message to propagate if inputResponse is continuous
   *
   * @param { MidiValue[] } msg The message from device
   * @return { MidiMessage } the message to propagate
   */
  #handleInputAsContinuous = (msg: MidiValue[]) => {
    return this.getResponse(msg);
  };

  /**
   * Returns the message to propagate if inputResponse is constant
   *
   * @param { MidiValue[] } msg The message from device
   * @return { MidiMessage } the message to propagate
   */
  #handleInputAsConstant = (msg: MidiValue[]) => {
    return this.getResponse(msg);
  };

  protected abstract getResponse(msg: MidiValue[]): MidiMessage | null;

  abstract get eligibleStates(): string[];

  abstract get defaultState(): string;

  abstract get state(): string;
}
