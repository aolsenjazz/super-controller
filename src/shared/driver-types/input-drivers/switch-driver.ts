import { InteractiveInputDriver } from './interactive-input-driver';

export interface SwitchDriver extends InteractiveInputDriver {
  type: 'switch';

  // TODO: ugh, `constant` feels a litle too incorrect
  response: 'constant';

  /**
   * The default MIDI message sent for each step. Note that order is
   * important here; order will determine how steps are represented,
   * locationally, in the UI. The correct order of steps can be achieved both
   * through ordering here and usage of the `style` attribute
   */
  steps: NumberArrayWithStatus[];

  /**
   * List of labels associated with each step. Order is important; must correlate
   * `steps`. Ugly fix, but it's just impossible to generate intuitive names
   * from existing data.
   */
  stepLabels: string[];

  /**
   * Are `steps` rotated through such that the next step always === currentStep + 1?
   * Counterexample is if/when the switch can move both up or down
   */
  sequential: boolean;

  /**
   * Default step of this control
   */
  initialStep: number;
}
