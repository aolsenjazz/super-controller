import { MidiValue, Channel, EventType } from 'midi-message-parser';

import { Color } from '@shared/driver-types';
import { InputConfig } from '@shared/hardware-config';
import { CC_BINDINGS, stringVal } from '@shared/util';

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the eventType of several inputs whose `eventType`s are all 'noteon' would be
 * 'noteon' (of course). If one input in the group has a different value, the
 * `InputGroup` `eventType` value would be '<multiple values>'
 */
export class InputGroup {
  inputs: InputConfig[];

  constructor(inputs: (InputConfig | undefined)[]) {
    this.inputs = inputs.filter((c) => c !== undefined) as InputConfig[];
  }

  labelForNumber(n: MidiValue) {
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

  labelForChannel(c: Channel) {
    const nInputs = this.inputs.length;
    const isDefault = nInputs === 1 && c === this.inputs[0].default.channel;

    return `${c}${isDefault ? ' [default]' : ''}`;
  }

  labelForEventType(et: string) {
    const nInputs = this.inputs.length;
    const isDefault = nInputs === 1 && et === this.inputs[0].default.eventType;

    return `${et}${isDefault ? ' [default]' : ''}`;
  }

  labelForResponse(ps: string) {
    const nInputs = this.inputs.length;
    const isDefault = nInputs === 1 && ps === this.inputs[0].default.response;

    return `${ps}${isDefault ? ' [default]' : ''}`;
  }

  colorForState(state: string) {
    const color = this.#groupValue<Color | undefined>(
      (c) => c.colorForState(state),
      (a, b) => JSON.stringify(a) === JSON.stringify(b)
    );

    return color === undefined ? null : color;
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
    if (this.inputs.length === 0) return null;

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
    const equality = (a: string[], b: string[]) =>
      JSON.stringify(a) === JSON.stringify(b);
    return this.#getEligibleValues(getter, equality);
  }

  get eligibleColors() {
    const getter = (c: InputConfig) => c.availableColors;
    const equality = (a: Color[], b: Color[]) =>
      JSON.stringify(a) === JSON.stringify(b);
    return this.#getEligibleValues(getter, equality);
  }

  get isMultiInput() {
    return (
      this.inputs.filter((input) => input.type !== 'xy').length === 0 &&
      this.inputs.length > 1
    );
  }

  get number() {
    return this.#groupValue<MidiValue>(
      (c) => c.number,
      (a, b) => a === b
    );
  }

  get value() {
    return this.#groupValue<MidiValue>(
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
    return this.#groupValue<EventType>(
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
