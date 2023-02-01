import { Color, FxDriver } from '@shared/driver-types';
import { InputConfig, ColorImpl } from '@shared/hardware-config';
import { CC_BINDINGS, stringVal } from '@shared/util';

const mvc: Color = {
  name: '<multiple values>',
  string: 'transparent',
  eventType: 'noteon',
  value: 0,
};

const MULT_COLOR = ColorImpl.fromDrivers(mvc, 0, 0);

const mvf: FxDriver = {
  title: '<multiple values>',
  effect: '',
  validVals: [0],
  defaultVal: 0,
};

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the eventType of several inputs whose `eventType`s are all 'noteon' would be
 * 'noteon' (of course). If one input in the group has a different value, the
 * `InputGroup` `eventType` value would be '<multiple values>'
 */
export class InputGroup {
  inputs: InputConfig[];

  constructor(inputs: InputConfig[]) {
    this.inputs = inputs;
  }

  labelForNumber(n: number) {
    const nInputs = this.inputs.length;
    const et = this.eventType;

    if (nInputs === 0 || et === '<multiple values>') return n.toString();

    const input = this.inputs[0];
    const isDefault =
      nInputs === 1 &&
      input.default.number === n &&
      et === input.eventType &&
      input.eventType === input.default.eventType;

    let labelTitle;
    if (input.eventType === 'controlchange') {
      labelTitle = input.number === n ? '' : ` - ${CC_BINDINGS.get(n)}`;
    } else if (input.eventType === 'noteon/noteoff') {
      labelTitle = ` - ${stringVal(n)}`;
    } else {
      labelTitle = ``;
    }

    return `${n}${labelTitle}${isDefault ? ' [default]' : ''}`;
  }

  #labelFor = <T>(obj: T, defaultGetter: (input: InputConfig) => T) => {
    const nInputs = this.inputs.length;
    const isDefault = nInputs === 1 && defaultGetter(this.inputs[0]) === obj;
    return `${obj}${isDefault ? ' [default]' : ''}`;
  };

  labelForChannel(c: Channel) {
    return this.#labelFor(c, (input) => input.channel);
  }

  labelForEventType(et: string) {
    return this.#labelFor(et, (input) => input.eventType);
  }

  labelForResponse(response: string) {
    return this.#labelFor(response, (input) => input.response);
  }

  colorForState(state: number) {
    let color = this.#groupValue<ColorImpl | undefined>(
      (c) => c.colorForState(state),
      (a, b) => {
        if (!a && !b) return true;
        return !a ? false : a.displayName === b?.displayName;
      }
    );

    if (color === '<multiple values>') color = MULT_COLOR;

    return color === undefined ? null : (color as ColorImpl);
  }

  /**
   * Returns a value of type T which represents the value for all inputs in
   * the group. The field being accessed (eventType, number, etc) is determined
   * by `getterFn` while equality between individual values is determined with
   * `equalityFn`
   *
   * @param getterFn Returns the value being retrieve from `InputConfig`s
   * @param equalityFn Returns whether the values are equal
   * @returns A value representing all of the values in the group
   */
  #groupValue = <T>(
    getterFn: (config: InputConfig) => T,
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
   * The field being accessed (eventType, number, etc) is determined
   * by `getterFn` while equality between individual values is determined with
   * `equalityFn`
   *
   * @param getterFn Returns the value being retrieve from `InputConfig`s
   * @param equalityFn Returns whether the values are equal
   * @returns A value representing all of the values in the group
   */
  #getEligibleValues = <T>(
    getterFn: (i: InputConfig) => T[],
    equalityFn: (a: T[], b: T[]) => boolean
  ) => {
    if (this.inputs.length === 0) return [];

    const eligible = this.#groupValue(getterFn, equalityFn);
    return eligible === '<multiple values>'
      ? ([] as T[])
      : getterFn(this.inputs[0]);
  };

  get eligibleLightStates() {
    const getter = (c: InputConfig) => c.eligibleLightStates;
    const equality = (a: number[], b: number[]) =>
      JSON.stringify(a) === JSON.stringify(b);
    return this.#getEligibleValues(getter, equality);
  }

  get eligibleColors() {
    const getter = (c: InputConfig) => c.availableColors;
    const equality = (a: ColorImpl[], b: ColorImpl[]) => {
      const aIds = a.map((ac) => ac.displayName);
      const bIds = b.map((bc) => bc.displayName);
      return JSON.stringify(aIds) === JSON.stringify(bIds);
    };
    return this.#getEligibleValues(getter, equality);
  }

  get eligibleFx() {
    const getter = (c: InputConfig) => c.availableFx;
    const equality = (fx1: FxDriver[], fx2: FxDriver[]) =>
      JSON.stringify(fx1) === JSON.stringify(fx2);
    return this.#getEligibleValues(getter, equality);
  }

  getActiveFx(state: number) {
    const getter = (c: InputConfig) => c.getActiveFx(state);
    const equality = (a: FxDriver | undefined, b: FxDriver | undefined) => {
      return a === b;
    };
    const activeFx = this.#groupValue<FxDriver | undefined>(getter, equality);

    return activeFx === '<multiple values>' ? mvf : activeFx;
  }

  get isMultiInput() {
    return (
      this.inputs.filter((input) => input.type !== 'xy').length === 0 &&
      this.inputs.length > 1
    );
  }

  get number() {
    return this.#groupValue<number>(
      (c) => c.number,
      (a, b) => a === b
    );
  }

  get value() {
    return this.#groupValue<number>(
      (c) => c.value,
      (a, b) => a === b
    );
  }

  get channel() {
    return this.#groupValue<Channel>(
      (c) => c.channel,
      (a, b) => a === b
    );
  }

  get eventType() {
    return this.#groupValue<StatusString | 'noteon/noteoff'>(
      (c) => c.eventType,
      (a, b) => a === b
    );
  }

  get response() {
    return this.#groupValue(
      (c) => c.response,
      (a, b) => a === b
    );
  }

  get lightResponse() {
    return this.#groupValue(
      (c) => c.lightResponse,
      (a, b) => a === b
    );
  }

  get eligibleEventTypes() {
    return this.#getEligibleValues(
      (c) => c.eligibleEventTypes,
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
      (c) => c.eligibleLightResponses,
      (a, b) => JSON.stringify(a) === JSON.stringify(b)
    );
  }
}
