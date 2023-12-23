import { Color, ColorDescriptor, FxDriver } from '@shared/driver-types';
import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';
import { CC_BINDINGS, stringVal, colorDisplayName } from '@shared/util';

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

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the statusString of several inputs whose `statusString`s are all 'noteon' would be
 * 'noteon' (of course). If one input in the group has a different value, the
 * `InputGroup` `statusString` value would be '<multiple values>'
 */
export class InputGroup {
  inputs: MonoInputConfigStub[];

  constructor(inputs: MonoInputConfigStub[]) {
    this.inputs = inputs;
  }

  labelForNumber(n: number) {
    const nInputs = this.inputs.length;
    const et = this.statusString;

    if (nInputs === 0 || et === '<multiple values>') return n.toString();

    const input = this.inputs[0];
    const isDefault =
      nInputs === 1 &&
      input.defaults.number === n &&
      et === input.statusString &&
      input.statusString === input.defaults.statusString;

    let labelTitle;
    if (input.statusString === 'controlchange') {
      labelTitle = input.number === n ? '' : ` - ${CC_BINDINGS.get(n)}`;
    } else if (input.statusString === 'noteon/noteoff') {
      labelTitle = ` - ${stringVal(n)}`;
    } else {
      labelTitle = ``;
    }

    return `${n}${labelTitle}${isDefault ? ' [default]' : ''}`;
  }

  #labelFor = <T>(obj: T, defaultGetter: (input: MonoInputConfigStub) => T) => {
    const nInputs = this.inputs.length;
    const isDefault = nInputs === 1 && defaultGetter(this.inputs[0]) === obj;
    return `${obj}${isDefault ? ' [default]' : ''}`;
  };

  labelForChannel(c: Channel) {
    return this.#labelFor(c, (input) => input.defaults.channel);
  }

  labelForEventType(et: string) {
    return this.#labelFor(et, (input) => input.defaults.statusString);
  }

  labelForResponse(response: string) {
    return this.#labelFor(response, (input) => input.defaults.response);
  }

  colorForState(state: number) {
    let color = this.#groupValue<ColorDescriptor | undefined>(
      (c) =>
        c.colorConfig !== undefined
          ? c.colorConfig.states.get(state)?.color
          : undefined,
      (a, b) => {
        if (!a && !b) return true;
        return !a ? false : colorDisplayName(a) === colorDisplayName(b || mvc);
      }
    );

    if (color === '<multiple values>') color = mvc;

    return color === undefined ? null : (color as Color);
  }

  /**
   * Returns a value of type T which represents the value for all inputs in
   * the group. The field being accessed (statusString, number, etc) is determined
   * by `getterFn` while equality between individual values is determined with
   * `equalityFn`
   *
   * @param getterFn Returns the value being retrieve from `InputConfig`s
   * @param equalityFn Returns whether the values are equal
   * @returns A value representing all of the values in the group
   */
  #groupValue = <T>(
    getterFn: (config: MonoInputConfigStub) => T,
    equalityFn: (a: T, b: T) => boolean
  ) => {
    if (this.inputs.length === 0) return undefined;

    const vals = this.inputs.map(getterFn);
    const allMatch = vals.filter((v) => !equalityFn(v, vals[0])).length === 0;

    return allMatch ? vals[0] : '<multiple values>';
  };

  /**
   * Returns a list of all eligible values for the specified field in this `InputGroup`.
   * The list of eligible values in every `InputConfig` in this `InputGroup` must be
   * *exactly* the same.
   *
   * E.g. if InputA.availableColors === [RED] and InputB.availableColors === [RED, GREEN],
   * this function will return '<multiple values>'
   *
   * The field being accessed (statusString, number, etc) is determined
   * by `getterFn` while equality between individual values is determined with
   * `equalityFn`
   *
   * @param getterFn Returns the value being retrieve from `InputConfig`s
   * @param equalityFn Returns whether the values are equal
   * @returns A value representing all of the values in the group
   */
  #getEligibleValues = <T>(
    getterFn: (i: MonoInputConfigStub) => T[],
    equalityFn: (a: T[], b: T[]) => boolean
  ) => {
    if (this.inputs.length === 0) return [];

    const eligible = this.#groupValue(getterFn, equalityFn);
    return eligible === '<multiple values>'
      ? ([] as T[])
      : getterFn(this.inputs[0]);
  };

  get isEndlessCapable() {
    const getter = (c: MonoInputConfigStub) =>
      c.knobType !== undefined && c.knobType === 'endless';
    const equality = (a: boolean, b: boolean) => {
      return a === true && b === true;
    };
    return this.#groupValue(getter, equality);
  }

  get isEndlessMode() {
    const getter = (c: MonoInputConfigStub) =>
      c.valueType !== undefined && c.valueType === 'endless';
    const equality = (a: boolean, b: boolean) => {
      return a === b;
    };
    return this.#groupValue(getter, equality)!;
  }

  get eligibleLightStates() {
    const getter = (c: MonoInputConfigStub) =>
      c.colorConfig !== undefined ? c.colorConfig.eligibleLightStates : [];
    const equality = (a: number[], b: number[]) =>
      JSON.stringify(a) === JSON.stringify(b);
    return this.#getEligibleValues(getter, equality);
  }

  get eligibleColors() {
    const getter = (c: MonoInputConfigStub) =>
      c.colorConfig !== undefined ? c.colorConfig.availableColors : [];
    const equality = (a: ColorDescriptor[], b: ColorDescriptor[]) => {
      const aIds = a.map((ac) => colorDisplayName(ac));
      const bIds = b.map((bc) => colorDisplayName(bc));
      return JSON.stringify(aIds) === JSON.stringify(bIds);
    };
    return this.#getEligibleValues(getter, equality);
  }

  get eligibleFx() {
    const getter = (c: MonoInputConfigStub) =>
      c.colorConfig !== undefined ? c.colorConfig.availableFx : [];
    const equality = (fx1: FxDriver[], fx2: FxDriver[]) =>
      JSON.stringify(fx1) === JSON.stringify(fx2);
    return this.#getEligibleValues(getter, equality);
  }

  getActiveFx(state: number) {
    const getter = (c: MonoInputConfigStub) =>
      c.colorConfig !== undefined
        ? c.colorConfig.states.get(state)?.fx
        : undefined;
    const equality = (a: FxDriver | undefined, b: FxDriver | undefined) => {
      return a?.title === b?.title;
    };
    const activeFx = this.#groupValue<FxDriver | undefined>(getter, equality);

    return activeFx === '<multiple values>' ? mvf : activeFx;
  }

  getFxVal(state: number) {
    // TODO: this is probably buggy
    const getter = (c: MonoInputConfigStub) =>
      c.colorConfig !== undefined
        ? c.colorConfig.states.get(state)?.fx?.defaultVal
        : undefined;
    const equality = (
      a: MidiNumber[] | undefined,
      b: MidiNumber[] | undefined
    ) => {
      return JSON.stringify(a) === JSON.stringify(b);
    };
    return this.#groupValue<MidiNumber[] | undefined>(getter, equality);
  }

  get isValueCapable() {
    return (
      this.response === 'constant' &&
      this.inputs.filter((i) => i.statusString === 'programchange').length === 0
    );
  }

  get number() {
    return this.#groupValue<number>(
      (c) => c.number,
      (a, b) => a === b
    );
  }

  get value() {
    if (this.isValueCapable === false)
      throw new Error(
        'tried to request value of non-value-capable input group'
      );

    return this.#groupValue<number>(
      (c) => c.value!,
      (a, b) => a === b
    );
  }

  get channel() {
    return this.#groupValue<Channel>(
      (c) => c.channel,
      (a, b) => a === b
    );
  }

  get statusString() {
    return this.#groupValue<StatusString | 'noteon/noteoff'>(
      (c) => c.statusString,
      (a, b) => a === b
    );
  }

  get response() {
    return this.#groupValue(
      (c) => c.outputResponse,
      (a, b) => a === b
    );
  }

  get lightResponse() {
    return this.#groupValue(
      (c) =>
        c.colorConfig !== undefined ? c.colorConfig.lightResponse : undefined,
      (a, b) => a === b
    );
  }

  get eligibleEventTypes() {
    return this.#getEligibleValues(
      (c) => c.eligibleStatusStrings,
      (a, b) => JSON.stringify(a) === JSON.stringify(b)
    );
  }

  get eligibleResponses() {
    return this.#getEligibleValues(
      (c) => c.eligibleResponses,
      (a, b) => JSON.stringify(a) === JSON.stringify(b)
    );
  }

  get eligibleLightResponses() {
    return this.#getEligibleValues(
      (c) =>
        c.colorConfig !== undefined ? c.colorConfig.eligibleLightResponses : [],
      (a, b) => JSON.stringify(a) === JSON.stringify(b)
    );
  }
}
