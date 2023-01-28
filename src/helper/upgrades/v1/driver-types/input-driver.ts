import { StatusString, Channel } from '../midi-util';
import { Color } from './color';

/**
 * Describes how event are propagated to clients. Not all inputs are eligible for
 * all responses; inputs who hardware response is 'toggle' can only propagate in
 * 'toggle' or 'constant' mode, because no events are fired from hardware on input release
 *
 * gate: event fired on press and release
 * toggle: event fired on press
 * continuous: continuous input
 * constant: event fired on press, always the same event
 */
export type InputResponse = 'gate' | 'toggle' | 'continuous' | 'constant';

/* Input type */
export type InputType = 'pad' | 'knob' | 'slider' | 'wheel' | 'xy';

/* Default values for the input loaded in from a driver */
export type InputDefault = {
  /* Note number, CC number, program number, etc */
  readonly number: number;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly eventType: StatusString | 'noteon/noteoff';

  /* See InputResponse */
  readonly response: InputResponse;
};

export type InputDriver = {
  /* See `InputDefault` */
  default: InputDefault;

  /* Physical shape of the input. circle + square have 1:1 aspect ratio enforced */
  shape: 'circle' | 'rect' | 'square';

  /* See InputType */
  type: InputType;

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

  /* What is the default value of this control? */
  value?: number;

  /* If input has a handle (think wheel or XY pad), width in inches */
  handleWidth?: number;

  /* If input has a handle (think wheel, or XY pad), height in inches */
  handleHeight?: number;
};
