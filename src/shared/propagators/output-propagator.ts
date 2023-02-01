import { MidiArray } from '../midi-array';

import { InputResponse } from '../driver-types';
import { Propagator } from './propagator';

/**
 * Propagates messages to clients. Responds differently depending on `outputResponse`,
 * and can be set to change response behaviour
 */
export class OutputPropagator extends Propagator {
  constantState: 'on' | 'off' = 'off';

  eventType: StatusString | 'noteon/noteoff';

  number: MidiNumber;

  channel: Channel;

  value: MidiNumber;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    eventType: StatusString | 'noteon/noteoff',
    number: MidiNumber,
    channel: Channel,
    value?: MidiNumber,
    lastPropagated?: MidiArray
  ) {
    super(hardwareResponse, outputResponse, lastPropagated);

    this.eventType = eventType;
    this.number = number;
    this.channel = channel;
    this.value = value === undefined ? 127 : value;
  }

  toJSON(includeState: boolean) {
    return JSON.stringify({
      type: 'OutputPropagator',
      hardwareResponse: this.hardwareResponse,
      outputResponse: this.outputResponse,
      eventType: this.eventType,
      number: this.number,
      channel: this.channel,
      value: this.value,
      lastPropagated: includeState ? this.lastPropagated : undefined,
    });
  }

  /**
   * Returns the next message to propagate given the received message
   *
   * @param msg The message to respond to
   * @returns The message to propagate
   */
  protected getResponse(msg: MidiArray) {
    // manually flip constant state if output response !== constant
    if (
      this.hardwareResponse === 'constant' &&
      this.outputResponse !== 'constant'
    ) {
      this.constantState = this.constantState === 'on' ? 'off' : 'on';
    }

    let response: MidiArray;
    switch (this.outputResponse) {
      case 'gate':
        response = this.#handleAsGate(msg);
        break;
      case 'toggle':
        response = this.#handleAsToggle(msg);
        break;
      case 'continuous':
        response =
          this.eventType === 'pitchbend'
            ? this.#handleAsPitchbend(msg)
            : this.#handleAsContinuous(msg);
        break;
      case 'constant':
        response = this.#handleAsConstant();
        break;
      default:
        throw new Error(`unknown outputResponse ${this.outputResponse}`);
    }

    if (response.isProgramChange) {
      // eslint-disable-next-line prefer-destructuring
      this.value = response[2];
    }

    return response;
  }

  /**
   * Returns the next message to propagate if in 'gate' mode
   *
   * @returns The message to propagate
   */
  #handleAsGate = (msg: MidiArray) => {
    const eventType = this.#nextEventType();
    const value = this.#nextValue(msg[2]);

    return MidiArray.create(eventType, this.channel, this.number, value);
  };

  /**
   * Returns the next message to propagate if in 'toggle' mode
   *
   * @returns The message to propagate
   */
  #handleAsToggle = (msg: MidiArray) => {
    const eventType = this.#nextEventType();
    let value = this.#nextValue(msg[2]);

    if (this.hardwareResponse === 'constant') {
      value = this.constantState === 'on' ? 127 : 0;
    }

    if (this.hardwareResponse === 'gate') {
      const defaultVal =
        !this.lastPropagated || !this.lastPropagated[2] ? 127 : 0;
      value = this.#nextValue(defaultVal);
    }

    return MidiArray.create(eventType, this.channel, this.number, value);
  };

  /**
   * Returns the next message that should be propagated while in 'continuous' mode
   *
   * @param msg The message being responded to
   * @returns The message to propagate
   */
  #handleAsContinuous = (msg: MidiArray) => {
    return MidiArray.create(
      this.#nextEventType(),
      this.channel,
      this.number,
      msg[2]
    );
  };

  /**
   * Returns the next message that should be propagated if the message being
   * responded to is of EventType 'pitchbend'
   *
   * @param msg The message from device being responded to
   * @returns The message to propagate
   */
  #handleAsPitchbend = (msg: MidiArray) => {
    return MidiArray.create(
      this.#nextEventType(),
      this.channel,
      msg[1],
      msg[2]
    );
  };

  /**
   * Returns the next message that should be propagated while in 'constant' mode
   *
   * @returns The message to propagate
   */
  #handleAsConstant = () => {
    if (this.value === undefined)
      throw new Error(`value must not be undefined`);

    return MidiArray.create(
      this.#nextEventType(),
      this.channel,
      this.number,
      this.#nextValue(this.value)
    );
  };

  /**
   * Returns the next EventType that should be propagated
   */
  #nextEventType = () => {
    switch (this.eventType) {
      case 'noteon/noteoff':
        return this.lastPropagated?.isNoteOn ? 'noteoff' : 'noteon';
        return 'noteon';
      case 'controlchange':
      case 'programchange':
      case 'pitchbend':
      case 'noteon':
      case 'noteoff':
        return this.eventType;
      default:
        throw new Error(`unknown eventType ${this.eventType}`);
    }
  };

  /**
   * Returns the next MIDI value (velocity, etc) that should be propagated
   *
   * @param defaultVal Value to return if a specific value isn't required
   */
  #nextValue = (defaultVal: MidiNumber) => {
    switch (this.#nextEventType()) {
      case 'noteoff':
        return 0;
      case 'noteon':
      case 'controlchange':
      case 'programchange':
      case 'pitchbend':
        return defaultVal;
      default:
        throw new Error(`unknown eventType ${this.eventType}`);
    }
  };
}
