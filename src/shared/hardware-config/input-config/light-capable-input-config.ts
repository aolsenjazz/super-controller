import { StatefulPropagator } from '../../propagators/stateful-propagator';

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
import {
  MonoInputConfig,
  InputDefault,
  MonoInputConfigStub,
} from './mono-input-config';

export type ColorConfigStub = {
  color?: ColorDescriptor;
  fx?: FxDriver;
  fxVal?: MidiNumber[];
};

export interface ColorCapableInputConfigStub extends MonoInputConfigStub {
  type: 'pad';
  colorCapable: true;
  lightResponse: 'gate' | 'toggle';
  availableColors: ColorDescriptor[];
  availableFx: FxDriver[];
  colorConfig: Map<number, ColorConfigStub>;
}

export abstract class LightCapableInputConfig extends MonoInputConfig {
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
    this.devicePropagator =
      devicePropagator ||
      (() => {
        let defaultColor: Color | undefined;
        this.availableColors.forEach((c) => {
          defaultColor = c.default ? c : defaultColor;
        });

        let defaultFx: FxDriver | undefined;
        this.availableFx.forEach((f) => {
          defaultFx = f.isDefault ? f : defaultFx;
        });

        return new ColorConfigPropagator(r, r, defaultColor, defaultFx);
      })();
  }

  // TODO: now that we're applying color update via applyStub, it's likely that the
  // API to change colors can be modified
  applyStub(s: ColorCapableInputConfigStub) {
    super.applyStub(s);

    this.lightResponse = s.lightResponse;
    s.colorConfig.forEach((v, k) => {
      if (v.color) {
        this.setColor(k, v.color.name);
      }
      if (v.fx) {
        this.setFx(k, v.fx);
      }
      if (v.fxVal) {
        this.setFxVal(k, v.fxVal);
      }
    });

    // reset propagator states. things can get messy when messing w/config in a non-default state
    this.devicePropagator.currentStep = 0; // reset propagator state
    if (this.outputPropagator instanceof StatefulPropagator) {
      this.outputPropagator.state = 'off';
    }
  }

  handleMessage(msg: MidiArray): MidiArray | undefined {
    this.devicePropagator.handleMessage(msg);
    return super.handleMessage(msg);
  }

  getColor(state: number): ColorDescriptor | undefined {
    return this.devicePropagator.getColor(state);
  }

  getFx(state: number): FxDriver | undefined {
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

  setFxVal(step: number, fx: MidiNumber[]) {
    this.devicePropagator.setFx(step, fx);
  }

  setFx(step: number, fx: string | FxDriver) {
    if (typeof fx === 'string') {
      let set = false;

      this.availableFx.forEach((f) => {
        if (f.title === fx) {
          this.devicePropagator.setFx(step, f.defaultVal);
          set = true;
        }
      });

      if (!set) throw new Error(`no matching fx for ${fx}`);
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
    super.restoreDefaults();
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
  }
}
