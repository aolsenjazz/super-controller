import { Color, ColorDescriptor, FxDriver } from '@shared/driver-types';
import { ColorCapableInputConfigStub } from '@shared/hardware-config/input-config/light-capable-input-config';
import { colorDisplayName } from '@shared/util';

import { BaseInputGroup } from './base-input-group';

function areColorDisplayNamesEqual(
  c1: ColorDescriptor | undefined,
  c2: ColorDescriptor | undefined
): boolean {
  if (c1 && c2) return colorDisplayName(c1) === colorDisplayName(c2);
  return c1 !== undefined || c2 !== undefined;
}

// "MultipleValuesColor": a default color to return when mutiple values exist
// TODO: smelly
const mvc: Color = {
  name: '<multiple values>',
  string: 'transparent',
  array: [144, 0, 0],
  effectable: false,
};

// "MutipleValuesFX": a default FX to return when mutiple values exist
// TODO: smelly
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

    // TODO: why are we return null here? should just be undefined.
    return color === undefined ? null : (color as Color);
  }

  public fxForState(state: number) {
    const getter = (c: ColorCapableInputConfigStub) =>
      c.colorConfig.get(state)?.fx;
    const equality = (a: FxDriver | undefined, b: FxDriver | undefined) => {
      return a?.title === b?.title;
    };
    const activeFx = this.groupValue<FxDriver | undefined>(getter, equality);

    return activeFx === '<multiple values>' ? mvf : activeFx;
  }

  public fxValForState(state: number) {
    // TODO: this is probably buggy
    const getter = (c: ColorCapableInputConfigStub) =>
      c.colorConfig.get(state)?.fx?.defaultVal;
    const equality = (
      a: MidiNumber[] | undefined,
      b: MidiNumber[] | undefined
    ) => {
      return JSON.stringify(a) === JSON.stringify(b);
    };
    return this.groupValue<MidiNumber[] | undefined>(getter, equality);
  }

  public get eligibleColors() {
    const getter = (c: ColorCapableInputConfigStub) => c.availableColors;
    const equality = (a: ColorDescriptor[], b: ColorDescriptor[]) => {
      const aIds = a.map((ac) => colorDisplayName(ac));
      const bIds = b.map((bc) => colorDisplayName(bc));
      return JSON.stringify(aIds) === JSON.stringify(bIds);
    };
    return this.getEligibleValues(getter, equality);
  }

  public get eligibleFx() {
    const getter = (c: ColorCapableInputConfigStub) => c.availableFx;
    const equality = (fx1: FxDriver[], fx2: FxDriver[]) =>
      JSON.stringify(fx1) === JSON.stringify(fx2);
    return this.getEligibleValues(getter, equality);
  }

  get lightResponse() {
    return this.groupValue((c) =>
      c.colorConfig !== undefined ? c.lightResponse : undefined
    );
  }

  /**
   * While pads are the only input which support colors, this function is simple
   */
  public get eligibleLightResponses() {
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
  public get eligibleLightStates() {
    return [0, 1];
  }
}
