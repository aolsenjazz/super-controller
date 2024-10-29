import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import { InputResponse } from '../driver-types';
import { Propagator } from './propagator';

@Revivable.register
export class NStepPropagator extends Propagator<InputResponse, InputResponse> {
  protected steps: Map<number, MidiArray>;

  currentStep: number = 0;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    steps: Map<number, MidiArray>,
    currentStep?: number,
  ) {
    super(hardwareResponse, outputResponse);

    this.steps = steps;
    this.currentStep = currentStep || 0;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.hardwareResponse,
        this.outputResponse,
        this.steps,
        this.currentStep,
      ],
    };
  }

  protected getResponse() {
    if (this.nSteps === 0) return undefined;

    this.currentStep =
      this.currentStep === this.nSteps - 1 ? 0 : this.currentStep + 1;

    return this.steps.get(this.currentStep);
  }

  setStep(number: number, step: MidiArray | NumberArrayWithStatus) {
    let s = step;
    if (step instanceof MidiArray === false) {
      s = create(s);
    }
    this.steps.set(number, s as MidiArray);
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
