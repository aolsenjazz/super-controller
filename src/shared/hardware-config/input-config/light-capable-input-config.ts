import { InputConfig, InputDefault } from './input-config';
import { MidiArray } from '../../midi-array';
import {
  OverrideablePropagator,
  ColorConfigPropagator,
} from '../../propagators';
import {
  InputResponse,
  FxDriver,
  Color,
  ColorDescriptor,
} from '../../driver-types';
import { colorDisplayName } from '../../util';

export abstract class LightCapableInputConfig extends InputConfig {
  protected readonly devicePropagator: ColorConfigPropagator;

  readonly availableColors: Color[];

  readonly availableFx: FxDriver[];

  constructor(
    defaultVals: InputDefault,
    availableColors: Color[],
    availableFx: FxDriver[],
    outputPropagator: OverrideablePropagator<InputResponse, InputResponse>,
    devicePropagator?: ColorConfigPropagator,
    nickname?: string
  ) {
    super(defaultVals, outputPropagator, nickname);

    this.availableColors = availableColors;
    this.availableFx = availableFx;

    const r = this.defaults.response;
    this.devicePropagator = devicePropagator || new ColorConfigPropagator(r, r);
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    this.devicePropagator.handleMessage(msg);
    return super.handleMessage(msg);
  }

  getColor(state: number): ColorDescriptor | undefined {
    return this.devicePropagator.getColor(state);
  }

  getFx(state: number) {
    const fxVal = this.devicePropagator.getFxVal(state);
    let fx;

    if (fxVal !== undefined) {
      this.availableFx.forEach((f) => {
        const contains =
          f.validVals.filter((v) => JSON.stringify(v) === JSON.stringify(fxVal))
            .length > 0;

        if (contains) {
          fx = f;
        }
      });
    }

    return fx;
  }

  getFxVal(step: number) {
    return this.devicePropagator.getFxVal(step);
  }

  setFx(step: number, fx: string | MidiNumber[] | FxDriver) {
    if (typeof fx === 'string') {
      let set = false;

      this.availableFx.forEach((f) => {
        if (f.title === fx) {
          this.devicePropagator.setFx(step, f.defaultVal);
          set = true;
        }
      });

      if (!set) throw new Error(`no matching fx for ${fx}`);
    } else if (Array.isArray(fx)) {
      this.devicePropagator.setFx(step, fx);
    } else {
      this.devicePropagator.setFx(step, fx.defaultVal);
    }
  }

  setColor(step: number, colorOrDisplayName: string | Color) {
    if (typeof colorOrDisplayName === 'string') {
      let set = false;

      this.availableColors.forEach((c) => {
        if (colorDisplayName(c) === colorOrDisplayName) {
          this.devicePropagator.setColor(step, c);
          set = true;
        }
      });

      if (!set)
        throw new Error(
          `counldnt find matching color for ${colorOrDisplayName}`
        );
    } else {
      this.devicePropagator.setColor(step, colorOrDisplayName);
    }
  }

  restoreDefaults() {
    this.devicePropagator.restoreDefaults();
  }

  get currentColorArray() {
    return this.devicePropagator.repeat();
  }

  get currentColor(): ColorDescriptor | undefined {
    return this.devicePropagator.currentColor;
  }

  get currentFx() {
    return this.getFx(this.devicePropagator.currentStep);
  }

  get lightResponse() {
    return this.devicePropagator.outputResponse as 'gate' | 'toggle';
  }

  set lightResponse(response: 'gate' | 'toggle') {
    this.devicePropagator.outputResponse = response;

    this.devicePropagator.currentStep = 0; // reset propagator state
  }

  abstract get eligibleLightResponses(): InputResponse[];
  abstract get eligibleLightStates(): number[];
}
