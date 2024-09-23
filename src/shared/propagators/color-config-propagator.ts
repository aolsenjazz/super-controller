import {
  Color,
  ColorDescriptor,
  InputResponse,
  FxDriver,
} from '../driver-types';
import { Propagator } from './propagator';

export class ColorConfigPropagator extends Propagator<
  InputResponse,
  InputResponse
> {
  /* Which colors are set for which state */
  protected colorBindings: Map<number, Color>;

  /* Which fx values are set for each state */
  protected fxBindings: Map<number, MidiNumber[]>;

  /**
   * Default color to be returned for getResponse() && repeat()
   * if colorBindings are unset for given state
   */
  protected defaultColor?: Color;

  /**
   * Default fx to be applied to `effectable` colors when fx for a
   * given state is unset
   */
  protected defaultFx?: FxDriver;

  currentStep: number = 0;

  constructor(
    hardwareResponse: InputResponse,
    outputResponse: InputResponse,
    defaultColor?: Color,
    defaultFx?: FxDriver,
    colorBindings?: Map<number, Color>,
    fxBindings?: Map<number, MidiNumber[]>,
    currentStep?: number
  ) {
    super(hardwareResponse, outputResponse);

    this.defaultColor = defaultColor;
    this.defaultFx = defaultFx;

    this.colorBindings = colorBindings || new Map();
    this.fxBindings = fxBindings || new Map();
    this.currentStep = currentStep || 0;
  }

  /* Progresses currentStep && returns array to be sent to device */
  protected getResponse() {
    // increment step
    this.currentStep =
      this.currentStep === this.nSteps - 1 ? 0 : this.currentStep + 1;

    return this.repeat();
  }

  /* Returns the message to transmit to device for current state */
  repeat(): NumberArrayWithStatus | undefined {
    // get color for state, or if unset, default color
    const c = this.colorBindings.get(this.currentStep) || this.defaultColor;

    if (c !== undefined) {
      // apply fx for state, or if unset, default fx
      let arr: NumberArrayWithStatus = JSON.parse(JSON.stringify(c.array));
      const fx =
        this.fxBindings.get(this.currentStep) || this.defaultFx?.defaultVal;

      // only apply if color is effectable ('Off' is not)
      if (c.effectable === true && fx !== undefined) {
        arr = arr.map((v, i) => v + fx[i]) as NumberArrayWithStatus;
      }

      return [...arr] as NumberArrayWithStatus;
    }

    return undefined;
  }

  /* Clears all color and fx bindings */
  restoreDefaults() {
    Array.from(this.colorBindings.keys()).forEach((k) => {
      this.colorBindings.delete(k);
    });

    Array.from(this.fxBindings.keys()).forEach((k) => {
      this.fxBindings.delete(k);
    });
  }

  setColor(step: number, color: Color) {
    this.colorBindings.set(step, color);
  }

  setFx(step: number, fxVal: MidiNumber[]) {
    this.fxBindings.set(step, fxVal);
  }

  getColor(step: number): ColorDescriptor | undefined {
    return this.colorBindings.get(step) || this.defaultColor;
  }

  getFxVal(step: number) {
    const c = this.getColor(step);

    if (c !== undefined && c.effectable) {
      return this.fxBindings.get(step) || this.defaultFx?.defaultVal;
    }

    return undefined;
  }

  get currentFxVal() {
    return this.getFxVal(this.currentStep);
  }

  get currentColor(): ColorDescriptor | undefined {
    return this.getColor(this.currentStep);
  }

  protected get nSteps() {
    return this.colorBindings.size
      ? Math.max(...Array.from(this.colorBindings.keys())) + 1
      : 0;
  }
}
