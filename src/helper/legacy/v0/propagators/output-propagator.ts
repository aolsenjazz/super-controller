import { StatusString, Channel, setStatus, getStatus } from '../midi-util';

import { InputResponse } from '../driver-types';
import { Propagator } from './propagator';
import { isOnMessage } from '../util';

/**
 * Propagates messages to clients. Responds differently depending on `outputResponse`,
 * and can be set to change response behaviour
 */
export class OutputPropagator extends Propagator {
  constantState: 'on' | 'off' = 'off';

  eventType: StatusString | 'noteon/noteoff';

  number: number;

  channel: Channel;

  value: number;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    eventType: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel,
    value?: number,
    lastPropagated?: number[]
  ) {
    super(hardwareResponse, outputResponse, lastPropagated);

    this.eventType = eventType;
    this.number = number;
    this.channel = channel;
    this.value = value === undefined ? 127 : value;
  }

  /**
   * Returns the next message to propagate given the received message
   *
   * @param msg The message to respond to
   * @returns The message to propagate
   */
  protected getResponse(msg: number[]) {
    // manually flip constant state if output response !== constant
    if (
      this.hardwareResponse === 'constant' &&
      this.outputResponse !== 'constant'
    ) {
      this.constantState = this.constantState === 'on' ? 'off' : 'on';
    }

    let response: number[];
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

    if (getStatus(response).string === 'programchange') {
      response = [response[0], response[1]];
    } else {
      /* eslint-disable-next-line */
      this.value = response[2];
    }

    return response;
  }

  /**
   * Returns the next message to propagate if in 'gate' mode
   *
   * @returns The message to propagate
   */
  #handleAsGate = (msg: number[]) => {
    const eventType = this.#nextEventType();
    const value = this.#nextValue(msg[2]);

    return setStatus([this.channel, this.number, value], eventType);
  };

  /**
   * Returns the next message to propagate if in 'toggle' mode
   *
   * @returns The message to propagate
   */
  #handleAsToggle = (msg: number[]) => {
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

    return setStatus([this.channel, this.number, value], eventType);
  };

  /**
   * Returns the next message that should be propagated while in 'continuous' mode
   *
   * @param msg The message being responded to
   * @returns The message to propagate
   */
  #handleAsContinuous = (msg: number[]) => {
    return setStatus(
      [this.channel, this.number, msg[2]],
      this.#nextEventType()
    );
  };

  /**
   * Returns the next message that should be propagated if the message being
   * responded to is of EventType 'pitchbend'
   *
   * @param msg The message from device being responded to
   * @returns The message to propagate
   */
  #handleAsPitchbend = (msg: number[]) => {
    return setStatus([this.channel, msg[1], msg[2]], this.#nextEventType());
  };

  /**
   * Returns the next message that should be propagated while in 'constant' mode
   *
   * @returns The message to propagate
   */
  #handleAsConstant = () => {
    if (this.value === undefined)
      throw new Error(`value must not be undefined`);

    return setStatus(
      [this.channel, this.number, this.#nextValue(this.value)],
      this.#nextEventType()
    );
  };

  /**
   * Returns the next EventType that should be propagated
   */
  #nextEventType = () => {
    switch (this.eventType) {
      case 'noteon/noteoff':
        if (this.lastPropagated) {
          const status = getStatus(this.lastPropagated).string;
          return status === 'noteon' ? 'noteoff' : 'noteon';
        }

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
  #nextValue = (defaultVal: number) => {
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
    if (this.hardwareResponse === 'constant') {
      return this.constantState;
    }

    if (['gate', 'toggle'].includes(this.outputResponse)) {
      if (this.lastPropagated === undefined) return 'off';

      return isOnMessage(this.lastPropagated, true) ? 'on' : 'off';
    }

    return this.lastPropagated ? this.lastPropagated[2].toString() : '0';
  }
}
