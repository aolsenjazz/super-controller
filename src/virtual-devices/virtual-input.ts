import { EventType, MidiValue, Channel } from 'midi-message-parser';

import { InputDriver } from '../driver-types';
import { inputIdFor } from '../device-util';

/**
 * Contains layout information to create a virtual representation of an input.
 *
 * Should not be confused with `InputConfig` (contains configuration, overrides)
 */
export class VirtualInput {
  /* Shape of the input. 'circle' and 'square' have their aspect ratios enforced */
  readonly shape: 'rect' | 'circle' | 'square';

  /* 'knob' | 'pad' | 'slider' | 'wheel' | 'xy' */
  /* TODO: should really change the ts type of this */
  readonly type: string;

  /* Can the input be overridden? `false` if the input doesn't transmit data to clients */
  readonly overrideable: boolean;

  /* Height of the input in inches */
  readonly height: number;

  /* Width of the input in inches */
  readonly width: number;

  /* If input has a handle (think wheel or XY pad), width in inches */
  readonly handleWidth?: number;

  /* If input has a handle (think wheel, or XY pad), height in inches */
  readonly handleHeight?: number;

  /* MIDI event type */
  #eventType: EventType;

  /* Note number, CC number, program number, etc */
  #number: MidiValue;

  /* MIDI channel */
  #channel: Channel;

  /**
   * Constructs a VirtualInput from a driver
   *
   * @param { InputDriver } driver The Driver
   * @return { VirtualInput } A new instance of VirtualInput
   */
  static fromDriver(driver: InputDriver) {
    return new VirtualInput(
      driver.width,
      driver.height,
      driver.default.eventType,
      driver.default.channel,
      driver.default.number,
      driver.shape,
      driver.type,
      driver.overrideable,
      driver.handleWidth,
      driver.handleHeight
    );
  }

  constructor(
    width: number,
    height: number,
    eventType: EventType,
    channel: Channel,
    number: MidiValue,
    shape: 'rect' | 'square' | 'circle',
    type: string,
    overrideable: boolean,
    handleWidth?: number,
    handleHeight?: number
  ) {
    this.width = width;
    this.height = height;
    this.shape = shape;
    this.type = type;
    this.#eventType = eventType;
    this.#channel = channel;
    this.#number = number;
    this.overrideable = overrideable;
    this.handleWidth = handleWidth;
    this.handleHeight = handleHeight;
  }

  get id() {
    return inputIdFor(this.#number, this.#channel, this.#eventType);
  }

  get isPitchbend() {
    return this.#eventType === 'pitchbend';
  }
}
