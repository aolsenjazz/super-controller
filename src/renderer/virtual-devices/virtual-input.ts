import { InputDriver, InputType } from '@shared/driver-types';
import { inputIdFor } from '@shared/util';

/**
 * Contains layout information to create a virtual representation of an input.
 *
 * Should not be confused with `InputConfig` (contains configuration, overrides)
 */
export class VirtualInput {
  /* Shape of the input. 'circle' and 'square' have their aspect ratios enforced */
  readonly shape: 'rect' | 'circle' | 'square';

  /* 'knob' | 'pad' | 'slider' | 'wheel' | 'xy' */
  readonly type: InputType;

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
  #eventType: StatusString | 'noteon/noteoff';

  /* Note number, CC number, program number, etc */
  #number: number;

  /* MIDI channel */
  #channel: Channel;

  constructor(driver: InputDriver) {
    this.width = driver.width;
    this.height = driver.height;
    this.shape = driver.shape;
    this.type = driver.type;
    this.#eventType = driver.default.eventType;
    this.#channel = driver.default.channel;
    this.#number = driver.default.number;
    this.overrideable = driver.overrideable;
    this.handleWidth = driver.handleWidth;
    this.handleHeight = driver.handleHeight;
  }

  get id() {
    return inputIdFor(this.#eventType, this.#channel, this.#number);
  }

  get isPitchbend() {
    return this.#eventType === 'pitchbend';
  }
}
