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
export class NonsequentialStepPropagator extends Propagator<
  'enumerated',
  'enumerated'
> {
  defaultStep: NumberArrayWithStatus;

  steps: Map<string, NumberArrayWithStatus>;

  lastStep: NumberArrayWithStatus;

  constructor(
    steps: Map<string, NumberArrayWithStatus>,
    defaultStep: NumberArrayWithStatus
  ) {
    super('enumerated', 'enumerated');

    this.steps = steps;
    this.defaultStep = defaultStep;
    this.lastStep = defaultStep;
  }

  protected getResponse(arr: NumberArrayWithStatus) {
    this.lastStep = arr as NumberArrayWithStatus;
    return this.steps.get(JSON.stringify(arr));
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
  setStep(step: NumberArrayWithStatus, arr: NumberArrayWithStatus) {
    this.steps.set(JSON.stringify(step), arr);
  }

  restoreDefaults() {
    Array.from(this.steps.keys()).forEach((k) => {
      const reset = JSON.parse(k);
      this.steps.set(k, reset);
    });
  }
}
