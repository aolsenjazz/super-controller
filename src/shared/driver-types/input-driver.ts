import { Color } from './color';
import { FxDriver } from './fx-driver';

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

export type InputDriver = {
  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel?: Channel;

  /* MIDI event type */
  readonly eventType?: StatusString | 'noteon/noteoff';

  /* What is the default value of this control? */
  readonly value?: MidiNumber;

  /* See InputResponse */
  readonly response?: InputResponse;

  /* Physical shape of the input. circle + square have 1:1 aspect ratio enforced */
  readonly shape?: 'circle' | 'rect' | 'square';

  /* See InputType */
  readonly type?: InputType;

  /* Can the input be overridden? `false` if the input does not transmit data to clients */
  readonly overrideable?: boolean;

  /* Height of the input in inches */
  readonly height?: number;

  /* Width of the input in inches */
  readonly width?: number;

  /* If input has a handle (think wheel or XY pad), width in inches */
  readonly handleWidth?: number;

  /* If input has a handle (think wheel, or XY pad), height in inches */
  readonly handleHeight?: number;

  readonly knobType?: 'endless' | 'absolute';

  /**
   * List of `Color`s this input supports. This field will by default be inherited
   * from the parent `InputGrid`, but that value may be overridden by setting it here.
   */
  readonly availableColors?: Color[];

  readonly availableFx?: FxDriver[];
};
