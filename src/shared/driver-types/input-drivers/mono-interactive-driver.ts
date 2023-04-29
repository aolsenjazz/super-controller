import { InteractiveInputDriver } from './interactive-input-driver';
import { Color } from '../color';
import { FxDriver } from '../fx-driver';

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
export type InputResponse =
  | 'gate'
  | 'toggle'
  | 'continuous'
  | 'constant'
  | 'enumerated';

export interface MonoInteractiveDriver extends InteractiveInputDriver {
  /* See `InputResponse` */
  readonly response: InputResponse;

  /* Note number, CC number, program number, etc */
  readonly number: MidiNumber;

  /* MIDI channel */
  readonly channel: Channel;

  /* MIDI event type */
  readonly status: StatusString | 'noteon/noteoff';

  /**
   * List of `Color`s this input supports. This field will by default be inherited
   * from the parent `InputGrid`, but that value may be overridden by setting it here.
   */
  readonly availableColors: Color[];

  readonly availableFx: FxDriver[];
}
