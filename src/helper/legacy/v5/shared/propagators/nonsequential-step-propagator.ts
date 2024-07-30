import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import { Propagator } from './propagator';

/**
 * Propagator which pages through enumerated steps. For example, one could
 * imagine a 3-state switch, where the following positions are:
 *
 * Up: [176, 32, 0]
 * Middle: [176, 32, 1]
 * Bottom: [176, 32, 2]
 *
 * Propagated values and default values are stored inside of `this.steps` where each
 * key is a JSON.stringify'd representation of the hardware-generated message for
 * a given message, and the value is its override.
 */
@Revivable.register
export class NonsequentialStepPropagator extends Propagator<
  'enumerated',
  'enumerated'
> {
  defaultStep: NumberArrayWithStatus;

  steps: Map<string, MidiArray>;

  lastStep: NumberArrayWithStatus;

  constructor(
    steps: Map<string, MidiArray>,
    defaultStep: NumberArrayWithStatus
  ) {
    super('enumerated', 'enumerated');

    this.steps = steps;
    this.defaultStep = defaultStep;
    this.lastStep = defaultStep;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.steps, this.defaultStep],
    };
  }

  protected getResponse(arr: MidiArray) {
    this.lastStep = arr.array as NumberArrayWithStatus;
    return this.steps.get(JSON.stringify(arr.array));
  }

  /**
   * Returns the override for the `step`.
   */
  responseForStep(step: NumberArrayWithStatus) {
    return this.steps.get(JSON.stringify(step));
  }

  /**
   * Sets the override for `step` equal to `arr`
   */
  setStep(step: NumberArrayWithStatus, arr: MidiArray) {
    this.steps.set(JSON.stringify(step), arr);
  }

  restoreDefaults() {
    Array.from(this.steps.keys()).forEach((k) => {
      const reset = create(JSON.parse(k));
      this.steps.set(k, reset);
    });
  }
}
