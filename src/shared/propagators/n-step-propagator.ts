import { MidiArray } from '../midi-array';
import { InputResponse } from '../driver-types';
import { Propagator, CorrelatedResponse } from './propagator';

export class NStepPropagator extends Propagator<
  InputResponse,
  CorrelatedResponse<InputResponse>
> {
  protected steps: Map<number, MidiArray | undefined>;

  currentStep: number = 0;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: CorrelatedResponse<InputResponse>,
    steps: Map<number, MidiArray | undefined>,
    currentStep?: number
  ) {
    super(hardwareResponse, outputResponse);

    this.steps = steps;
    this.currentStep = currentStep || 0;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      steps: Array.from(this.steps.entries()),
      currentStep: this.currentStep,
    };
  }

  protected getResponse() {
    if (this.nSteps === 0) return undefined;

    this.currentStep =
      this.currentStep === this.nSteps - 1 ? 0 : this.currentStep + 1;

    return this.steps.get(this.currentStep);
  }

  setStep(number: number, step: MidiArray) {
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
