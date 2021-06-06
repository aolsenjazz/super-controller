import {
  MidiValue,
  MidiMessage,
  Channel,
  EventType,
} from 'midi-message-parser';

import { Propagator } from './propagator';
import { isOnMessage } from '../util';

export class OutputPropagator extends Propagator {
  eventType: EventType;

  number: MidiValue;

  channel: Channel;

  value: MidiValue;

  constructor(
    inputResponse: 'gate' | 'toggle' | 'linear',
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
    if (['gate', 'toggle'].includes(this.outputResponse)) {
      return isOnMessage(this.lastPropagated) ? 'on' : 'off';
    }

    if (this.outputResponse === 'constant') {
      // TODO: probably program change, need to figure this out
    }

    return this.lastPropagated ? this.lastPropagated.value.toString() : '0';
  }

  protected getResponse(msg: MidiValue[]) {
    switch (this.outputResponse) {
      case 'gate':
        return this.#handleAsGate(msg);
      case 'toggle':
        return this.#handleAsToggle(msg);
      case 'linear':
        return this.#handleAsLinear(msg);
      case 'constant':
        return this.#handleAsConstant();
      default:
        throw new Error(`unknown outputResponse ${this.outputResponse}`);
    }
  }

  #handleAsGate = (msg: MidiValue[]) => {
    const eventType = this.#nextEventType();
    const value = this.#nextValue(msg[2]);

    return new MidiMessage(eventType, this.number, value, this.channel, 0);
  };

  #handleAsToggle = (msg: MidiValue[]) => {
    const eventType = this.#nextEventType();
    let value = this.#nextValue(msg[2]);

    if (this.inputResponse === 'gate') {
      const defaultVal = !this.lastPropagated?.value ? 127 : 0;
      value = this.#nextValue(defaultVal);
    }

    return new MidiMessage(eventType, this.number, value, this.channel, 0);
  };

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
}
