import { EventType, MidiValue, Channel } from 'midi-message-parser';

import { InputDriver } from '../driver-types';
import { inputIdFor } from '../device-util';

export class VirtualInput {
  readonly shape?: string;

  readonly type: string;

  readonly overrideable: boolean;

  readonly height: number;

  readonly width: number;

  #eventType: EventType;

  #number: MidiValue;

  #channel: Channel;

  static fromDriver(driver: InputDriver) {
    return new VirtualInput(
      driver.width,
      driver.height,
      driver.default.eventType,
      driver.default.channel,
      driver.default.number,
      driver.shape,
      driver.type,
      driver.overrideable
    );
  }

  constructor(
    width: number,
    height: number,
    eventType: EventType,
    channel: Channel,
    number: MidiValue,
    shape: string,
    type: string,
    overrideable: boolean
  ) {
    this.width = width;
    this.height = height;
    this.shape = shape;
    this.type = type;
    this.#eventType = eventType;
    this.#channel = channel;
    this.#number = number;
    this.overrideable = overrideable;
  }

  get id() {
    return inputIdFor(this.#number, this.#channel, this.#eventType);
  }

  get isPitchbend() {
    return this.#eventType === 'pitchbend';
  }
}
