import { InteractiveInputDriver } from './interactive-input-driver';

export interface SwitchDriver extends InteractiveInputDriver {
  readonly type: 'switch';

  // TODO: ugh, `constant` feels a litle too incorrect
  readonly response: 'constant';

  /**
   * The default MIDI message sent for each step. Note that order is
   * important here; order will determine how steps are represented,
   * locationally, in the UI. The correct order of steps can be achieved both
   * through ordering here and usage of the `style` attribute
   */
  readonly steps: NumberArrayWithStatus[];

  /**
   * List of labels associated with each step. Order is important; must correlate
   * `steps`. Ugly fix, but it's just impossible to generate intuitive names
   * from existing data.
   */
  readonly stepLabels: string[];

  /**
   * Are `steps` rotated through such that the next step always === currentStep + 1?
   * Counterexample is if/when the switch can move both up or down
   */
  readonly sequential: boolean;

  /**
   * Default step of this control
   */
  readonly initialStep: number;

  readonly inverted: boolean;

  readonly horizontal: boolean;
}
