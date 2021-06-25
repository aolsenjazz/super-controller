import {
  MidiValue,
  MidiMessage,
  Channel,
  EventType,
} from 'midi-message-parser';

import { Propagator } from './propagator';
import { isOnMessage } from '../util';

/**
 * Propagates messages to clients. Responds differently depending on `outputResponse`,
 * and can be set to change response behaviour
 */
export class OutputPropagator extends Propagator {
  constantState: 'on' | 'off' = 'off';

  eventType: EventType;

  number: MidiValue;

  channel: Channel;

  value: MidiValue;

  constructor(
    inputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    outputResponse: 'gate' | 'toggle' | 'linear' | 'constant',
    eventType: EventType,
    number: MidiValue,
    channel: Channel,
    value?: MidiValue,
    lastPropagated?: MidiMessage
  ) {
    super(inputResponse, outputResponse, lastPropagated);

    this.eventType = eventType;
    this.number = number;
    this.channel = channel;
    this.value = value || 127;
  }

  /**
   * Returns the next message to propagate given the received message
   *
   * @param { MidiValue[] } msg The message to respond to
   * @return { MidiMessage } The message to propagate
   */
  protected getResponse(msg: MidiValue[]) {
    // we currently need to manually flip states if hardware response is constant
    if (this.inputResponse === 'constant') {
      this.constantState = this.constantState === 'on' ? 'off' : 'on';
    }

    switch (this.outputResponse) {
      case 'gate':
        return this.#handleAsGate(msg);
      case 'toggle':
        return this.#handleAsToggle(msg);
      case 'linear':
        return this.eventType === 'pitchbend'
          ? this.#handleAsPitchbend(msg)
          : this.#handleAsLinear(msg);
      case 'constant':
        return this.#handleAsConstant();
      default:
        throw new Error(`unknown outputResponse ${this.outputResponse}`);
    }
  }

  /**
   * Returns the next message to propagate if in 'gate' mode
   *
   * @return { MidiMessage } The message to propagate
   */
  #handleAsGate = (msg: MidiValue[]) => {
    const eventType = this.#nextEventType();
    const value = this.#nextValue(msg[2]);

    return new MidiMessage(eventType, this.number, value, this.channel, 0);
  };

  /**
   * Returns the next message to propagate if in 'toggle' mode
   *
   * @return { MidiMessage } The message to propagate
   */
  #handleAsToggle = (msg: MidiValue[]) => {
    const eventType = this.#nextEventType();
    let value = this.#nextValue(msg[2]);

    if (this.inputResponse === 'constant') {
      value = this.constantState === 'on' ? 127 : 0;
    }

    if (this.inputResponse === 'gate') {
      const defaultVal = !this.lastPropagated?.value ? 127 : 0;
      value = this.#nextValue(defaultVal);
    }

    return new MidiMessage(eventType, this.number, value, this.channel, 0);
  };

  /**
   * Returns the next message that should be propagated while in 'linear' mode
   *
   * @param { MidiValue[] } msg The message being responded to
   * @return { MidiMessage } The message to propagate
   */
  #handleAsLinear = (msg: MidiValue[]) => {
    // forward the same message every time, with overrides and value replaced
    return new MidiMessage(
      this.eventType,
      this.number,
      msg[2],
      this.channel,
      0
    );
  };

  /**
   * Returns the next message that should be propagated if the message being
   * responded to is of EventType 'pitchbend'
   *
   * @param { MidiValue[] } msg The message from device being responded to
   * @return { MidiMessage } The message to propagate
   */
  #handleAsPitchbend = (msg: MidiValue[]) => {
    const mm = new MidiMessage(msg, 0);
    mm.channel = this.channel;
    return mm;
  };

  /**
   * Returns the next message that should be propagated while in 'constant' mode
   *
   * @return { MidiMessage } The message to propagate
   */
  #handleAsConstant = () => {
    if (this.value === undefined)
      throw new Error(`value must not be undefined`);

    const mm = new MidiMessage(
      this.eventType,
      this.number,
      this.value,
      this.channel,
      0
    );

    return mm;
  };

  /**
   * Returns the next EventType that should be propagated
   */
  #nextEventType = () => {
    switch (this.eventType) {
      case 'noteon/noteoff':
        return this.lastPropagated?.type === 'noteon' ? 'noteoff' : 'noteon';
      case 'controlchange':
      case 'programchange':
      case 'pitchbend':
        return this.eventType;
      default:
        throw new Error(`unknown eventType ${this.eventType}`);
    }
  };

  /**
   * Returns the next MIDI value (velocity, etc) that should be propagated
   *
   * @param { MidiValue } defaultVal Value to return if a specific value isn't required
   */
  #nextValue = (defaultVal: MidiValue) => {
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

  get eligibleStates() {
    if (['gate', 'toggle'].includes(this.outputResponse)) {
      return ['off', 'on'];
    }

    return [];
  }

  get defaultState() {
    if (['gate', 'toggle'].includes(this.outputResponse)) {
      return 'off';
    }

    return '0';
  }

  get state() {
    if (this.inputResponse === 'constant') {
      return this.constantState;
    }

    if (['gate', 'toggle'].includes(this.outputResponse)) {
      return isOnMessage(this.lastPropagated) ? 'on' : 'off';
    }

    return this.lastPropagated ? this.lastPropagated.value.toString() : '0';
  }
}
