// import { ColorDescriptor, FxDriver } from '@shared/driver-types';
// import { ColorCapableInputConfigStub } from '@shared/hardware-config/input-config/light-capable-input-config';
// import { colorDisplayName } from '@shared/util';

import { BaseInputGroup } from './base-input-group';

// function areColorDisplayNamesEqual(
//   c1: ColorDescriptor | undefined,
//   c2: ColorDescriptor | undefined
// ): boolean {
//   if (c1 && c2) return colorDisplayName(c1) === colorDisplayName(c2);
//   return c1 !== undefined || c2 !== undefined || true;
// }

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the statusString of several inputs whose `statusString`s are all 'noteon' would be
 * 'noteon'. If one input in the group has a different value, `InputGroup.statusString`
 * would be '<multiple values>'.
 *
 * Extends `BaseInputGroup`, adding supported for color-capable input fields
 */
export class ColorCapableInputGroup extends BaseInputGroup {
  public colorForState(_state: number) {
    // return this.groupValue<ColorDescriptor | undefined>(
    //   (c) => c.colorConfig.get(state)?.color,
    //   (a, b) => areColorDisplayNamesEqual(a, b)
    // );
    return undefined;
  }

  public fxForState(_state: number) {
    // const getter = (c: ColorCapableInputConfigStub) =>
    //   c.colorConfig.get(state)?.fx;
    // const equality = (a: FxDriver | undefined, b: FxDriver | undefined) => {
    //   return a?.title === b?.title;
    // };

    // let activeFx = this.groupValue<FxDriver | undefined>(getter, equality);
    // const defaultFx = this.availableFx.filter((fx) => fx.isDefault);
    // const color = this.colorForState(state);

    // if (
    //   typeof color !== 'string' &&
    //   color?.effectable &&
    //   activeFx === undefined &&
    //   defaultFx.length === 1
    // ) {
    //   [activeFx] = defaultFx;
    // }

    // return activeFx;
    return undefined;
  }

  public fxValForState(_state: number) {
    // const getter = (c: ColorCapableInputConfigStub) =>
    //   c.colorConfig.get(state)?.fxVal;
    // const equality = (
    //   a: MidiNumber[] | undefined,
    //   b: MidiNumber[] | undefined
    // ) => {
    //   return JSON.stringify(a) === JSON.stringify(b);
    // };

    // const fx = this.fxForState(state);
    // let fxVal = this.groupValue<MidiNumber[] | undefined>(getter, equality);
    // if (fxVal === undefined && fx !== undefined && typeof fx !== 'string') {
    //   fxVal = fx.defaultVal;
    // }

    // return fxVal;
    return undefined;
  }

  public get availableColors() {
    // const getter = (c: ColorCapableInputConfigStub) => c.availableColors;
    // const equality = (a: ColorDescriptor[], b: ColorDescriptor[]) => {
    //   const aIds = a.map((ac) => colorDisplayName(ac));
    //   const bIds = b.map((bc) => colorDisplayName(bc));
    //   return JSON.stringify(aIds) === JSON.stringify(bIds);
    // };
    // return this.getEligibleValues(getter, equality);
    return [];
  }

  public get availableFx() {
    // const getter = (c: ColorCapableInputConfigStub) => c.availableFx;
    // const equality = (fx1: FxDriver[], fx2: FxDriver[]) =>
    //   JSON.stringify(fx1) === JSON.stringify(fx2);
    // return this.getEligibleValues(getter, equality);
    return [];
  }

  get lightResponse() {
    // return this.groupValue((c) => c.lightResponse);
    return 'toggle';
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
