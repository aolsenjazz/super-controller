import { InputResponse } from '../driver-types';
import { Propagator } from './propagator';

export class NStepPropagator extends Propagator<InputResponse, InputResponse> {
  protected steps: Map<number, NumberArrayWithStatus>;

  currentStep: number = 0;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    steps: Map<number, NumberArrayWithStatus>,
    currentStep?: number
  ) {
    super(hardwareResponse, outputResponse);

    this.steps = steps;
    this.currentStep = currentStep || 0;
  }

  protected getResponse() {
    if (this.nSteps === 0) return undefined;

    this.currentStep =
      this.currentStep === this.nSteps - 1 ? 0 : this.currentStep + 1;

    return this.steps.get(this.currentStep);
  }

  setStep(number: number, step: NumberArrayWithStatus) {
    this.steps.set(number, step);
  }

  responseForStep(step: number) {
    return this.steps.get(step);
  }

  responseForCurrentStep() {
    return this.steps.get(this.currentStep);
  }

  get nSteps() {
    return this.steps.size ? Math.max(...Array.from(this.steps.keys())) + 1 : 0;
  }
}
