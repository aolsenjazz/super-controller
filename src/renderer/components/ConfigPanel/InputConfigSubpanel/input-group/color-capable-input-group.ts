import { Color, ColorDescriptor, FxDriver } from '@shared/driver-types';
import { ColorCapableInputConfigStub } from '@shared/hardware-config/input-config/light-capable-input-config';
import { colorDisplayName } from '@shared/util';

import { BaseInputGroup } from './base-input-group';

function areColorDisplayNamesEqual(
  c1: ColorDescriptor | undefined,
  c2: ColorDescriptor | undefined
): boolean {
  if (c1 && c2) return colorDisplayName(c1) === colorDisplayName(c2);
  return c1 !== undefined || c2 !== undefined || true;
}

/**
 * When a multiple inputs are selected with different colors set, we use this object to
 * set the "color hint", label, and hide FX.
 *
 * TODO: Probably makes sense to put this closer to UI logic given the subject matter
 */
const mvc: Color = {
  name: '<multiple values>',
  string: 'transparent',
  array: [144, 0, 0],
  effectable: false,
};

const mvf: FxDriver = {
  title: '<multiple values>',
  effect: '',
  isDefault: true,
  validVals: [[0, 0, 0]],
  defaultVal: [0, 0, 0],
};

export class ColorCapableInputGroup extends BaseInputGroup<ColorCapableInputConfigStub> {
  public colorForState(state: number) {
    let color = this.groupValue<ColorDescriptor | undefined>(
      (c) => c.colorConfig.get(state)?.color,
      (a, b) => areColorDisplayNamesEqual(a, b)
    );

    if (color === '<multiple values>') color = mvc;

    return color === undefined ? undefined : (color as Color);
  }

  public fxForState(state: number): FxDriver | undefined {
    const getter = (c: ColorCapableInputConfigStub) =>
      c.colorConfig.get(state)?.fx;
    const equality = (a: FxDriver | undefined, b: FxDriver | undefined) => {
      return a?.title === b?.title;
    };

    let activeFx = this.groupValue<FxDriver | undefined>(getter, equality);
    const defaultFx = this.availableFx.filter((fx) => fx.isDefault);
    const color = this.colorForState(state);

    if (color?.effectable && activeFx === undefined && defaultFx.length === 1) {
      [activeFx] = defaultFx;
    }

    return typeof activeFx === 'string' ? mvf : activeFx;
  }

  public fxValForState(state: number) {
    const getter = (c: ColorCapableInputConfigStub) =>
      c.colorConfig.get(state)?.fxVal;
    const equality = (
      a: MidiNumber[] | undefined,
      b: MidiNumber[] | undefined
    ) => {
      return JSON.stringify(a) === JSON.stringify(b);
    };

    const fx = this.fxForState(state);
    let fxVal = this.groupValue<MidiNumber[] | undefined>(getter, equality);
    if (fxVal === undefined && fx !== undefined) {
      fxVal = fx.defaultVal;
    }

    return fxVal;
  }

  public get availableColors() {
    const getter = (c: ColorCapableInputConfigStub) => c.availableColors;
    const equality = (a: ColorDescriptor[], b: ColorDescriptor[]) => {
      const aIds = a.map((ac) => colorDisplayName(ac));
      const bIds = b.map((bc) => colorDisplayName(bc));
      return JSON.stringify(aIds) === JSON.stringify(bIds);
    };
    return this.getEligibleValues(getter, equality);
  }

  public get availableFx() {
    const getter = (c: ColorCapableInputConfigStub) => c.availableFx;
    const equality = (fx1: FxDriver[], fx2: FxDriver[]) =>
      JSON.stringify(fx1) === JSON.stringify(fx2);
    return this.getEligibleValues(getter, equality);
  }

  get lightResponse() {
    return this.groupValue((c) => c.lightResponse);
  }

  /**
   * While pads are the only input which support colors, this function is simple
   */
  public get availableLightResponses(): ('gate' | 'toggle')[] {
    const input = this.inputs[0];
    switch (input.defaults.response) {
      case 'constant':
      case 'gate':
        return ['gate', 'toggle'];
      case 'toggle':
        return ['toggle'];
      default:
        return [];
    }
  }

  /**
   * While pads are the only input which support colors, and while pads are only
   * supported with 2 states, this will always be `[0, 1]`
   */
  public get availableLightStates() {
    return [0, 1];
  }
}
