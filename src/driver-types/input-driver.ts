import { MidiValue, EventType, Channel } from 'midi-message-parser';
import { Color } from './color';

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiValue;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly eventType: EventType;

  /**
   * Describes how the hardware input response to touch events
   *
   * gate: event fired on press and release
   * toggle: event fired on press
   * linear: continuous input (TODO: should probably be renamed to 'continuous')
   * constant: event fired on press, always the same event
   */
  readonly response: 'gate' | 'toggle' | 'linear' | 'constant';
};

export type InputDriver = {
  /* See `InputDefault` */
  default: InputDefault;

  /* Physical shape of the input. circle + square have 1:1 aspect ratio enforced */
  shape: 'circle' | 'rect' | 'square';

  /* Input type */
  type: 'knob' | 'pad' | 'slider' | 'wheel' | 'xy';

  /**
   * List of `Color`s this input supports. For inputs whose colors are controlled by
   * the device, this should be left empty.
   *
   * TODO: how do we represent RGB capabilities?
   */
  availableColors: Color[];

  /* Can the input be overridden? `false` if the input does not transmit data to clients */
  overrideable: boolean;

  /* Height of the input in inches */
  height: number;

  /* Width of the input in inches */
  width: number;

  /* If input has a handle (think wheel or XY pad), width in inches */
  handleWidth?: number;

  /* If input has a handle (think wheel, or XY pad), height in inches */
  handleHeight?: number;
};
