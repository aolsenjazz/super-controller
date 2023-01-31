import { MidiArray } from '../midi-array';

import { Propagator } from './propagator';
import { InputResponse } from '../driver-types';

export class NStepPropagator extends Propagator {
  #steps: Map<number, MidiArray | null>;

  currentStep: number = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TESTABLES = new Map<string, any>();

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    steps: Map<number, MidiArray | null>,
    currentStep?: number
  ) {
    super(hardwareResponse, outputResponse, undefined);

    this.#steps = steps;
    this.currentStep = currentStep || 0;

    this.TESTABLES.set('steps', this.#steps);
    this.TESTABLES.set('getResponse', this.getResponse.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toJSON(includeState: boolean) {
    return JSON.stringify({
      type: 'NStepPropagator',
      hardwareResponse: this.hardwareResponse,
      outputResponse: this.outputResponse,
      steps: Array.from(this.#steps.entries()),
      currentStep: includeState ? this.currentStep : undefined,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getResponse(_msg: MidiArray) {
    if (this.nSteps === 0) return null;

    this.currentStep =
      this.currentStep === this.nSteps - 1 ? 0 : this.currentStep + 1;

    const s = this.#steps.get(this.currentStep) || null;

    return s;
  }

  setStep(number: number, step: MidiArray | null) {
    this.#steps.set(number, step);
  }

  responseForStep(step: number) {
    return this.#steps.get(step) || null;
  }

  responseForCurrentStep() {
    return this.#steps.get(this.currentStep) || null;
  }

  get nSteps() {
    return this.#steps.size
      ? Math.max(...Array.from(this.#steps.keys())) + 1
      : 0;
  }
}
