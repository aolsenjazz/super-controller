import { InputDriver, InputType, InputGridDriver } from '@shared/driver-types';

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

  readonly horizontal: boolean;

  /* If input has a handle (think wheel or XY pad), width in inches */
  readonly handleWidth?: number;

  /* If input has a handle (think wheel, or XY pad), height in inches */
  readonly handleHeight?: number;

  /* MIDI event type */
  #eventType: StatusString | 'noteon/noteoff';

  /* Note number, CC number, program number, etc */
  #number: MidiNumber;

  /* MIDI channel */
  #channel: Channel;

  constructor(
    overrides: InputDriver,
    defaults: InputGridDriver['inputDefaults']
  ) {
    this.width = (overrides.width || defaults.width)!;
    this.height = (overrides.height || defaults.height)!;
    this.shape = (overrides.shape || defaults.shape)!;
    this.type = (overrides.type || defaults.type)!;
    this.#eventType = (overrides.eventType || defaults.eventType)!;
    this.#channel =
      overrides.channel !== undefined ? overrides.channel : defaults.channel!;
    this.#number = overrides.number;
    this.overrideable =
      overrides.overrideable !== undefined
        ? overrides.overrideable
        : defaults.overrideable!;
    this.handleWidth = overrides.handleWidth;
    this.handleHeight = overrides.handleHeight;
    this.horizontal = overrides.horizontal || false;
  }

  get id() {
    return this.isPitchbend
      ? `${this.#eventType}.${this.#channel}`
      : `${this.#eventType}.${this.#channel}.${this.#number}`;
  }

  get isPitchbend() {
    return this.#eventType === 'pitchbend';
  }
}
