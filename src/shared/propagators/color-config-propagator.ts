/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { create } from '../midi-array';
import { ColorImpl } from '../hardware-config/color-impl';
import { InputResponse } from '../driver-types';
import { Propagator, CorrelatedResponse } from './propagator';

@Revivable.register
export class ColorConfigPropagator extends Propagator<
  InputResponse,
  CorrelatedResponse<InputResponse>
> {
  protected colorBindings: Map<number, ColorImpl>;

  protected fxBindings: Map<number, MidiNumber[]>;

  currentStep: number = 0;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: CorrelatedResponse<InputResponse>,
    colorBindings?: Map<number, ColorImpl>,
    fxBindings?: Map<number, MidiNumber[]>,
    currentStep?: number
  ) {
    super(hardwareResponse, outputResponse);

    this.colorBindings = colorBindings || new Map();
    this.fxBindings = fxBindings || new Map();
    this.currentStep = currentStep || 0;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.hardwareResponse,
        this.outputResponse,
        this.colorBindings,
        this.fxBindings,
        this.currentStep,
      ],
    };
  }

  protected getResponse() {
    if (this.nSteps === 0) return undefined;

    this.currentStep =
      this.currentStep === this.nSteps - 1 ? 0 : this.currentStep + 1;

    const c = this.colorBindings.get(this.currentStep);
    const fx = this.fxBindings.get(this.currentStep);

    if (c !== undefined) {
      let arr = c.array;

      // apply fx
      if (fx !== undefined) {
        arr = arr.map((v, i) => v + fx[i]) as NumberArrayWithStatus;
      }

      return create(arr);
    }

    return undefined;
  }

  setColor(step: number, color: ColorImpl) {
    this.colorBindings.set(step, color);
    this.fxBindings.delete(step);
  }

  setFx(step: number, fxVal: MidiNumber[]) {
    this.fxBindings.set(step, fxVal);
  }

  getColor(step: number) {
    return this.colorBindings.get(step);
  }

  getFx(step: number) {
    return this.fxBindings.get(step);
  }

  get currentResponse() {
    const c = this.colorBindings.get(this.currentStep);
    const fx = this.fxBindings.get(this.currentStep);

    if (c !== undefined) {
      let arr = c.array;

      // apply fx
      if (fx !== undefined) {
        arr = arr.map((v, i) => v + fx[i]) as NumberArrayWithStatus;
      }

      return create(arr);
    }

    return undefined;
  }

  get currentFx() {
    return this.fxBindings.get(this.currentStep);
  }

  get currentColor() {
    return this.colorBindings.get(this.currentStep);
  }

  get nSteps() {
    return this.colorBindings.size
      ? Math.max(...Array.from(this.colorBindings.keys())) + 1
      : 0;
  }
}
