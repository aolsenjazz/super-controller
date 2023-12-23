import { InputResponse } from '@shared/driver-types';
import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';
import { CC_BINDINGS, stringVal } from '@shared/util';

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the statusString of several inputs whose `statusString`s are all 'noteon' would be
 * 'noteon' (of course). If one input in the group has a different value, the
 * `InputGroup` `statusString` value would be '<multiple values>'
 */
export class BaseInputGroup<K extends MonoInputConfigStub> {
  // TODO: can this be protected or private?
  inputs: K[];

  constructor(inputs: K[]) {
    this.inputs = inputs;
  }

  /**
   * Returns whether or not the given fieldValue is equal to the default value for
   * every `MonoInputConfigStub` in the input group, where each input's default value
   * is accessed via the `defaultGetter` param
   */
  protected isDefaultValue<T>(fieldValue: T, defaultGetter: (input: K) => T) {
    const nonDefaultValues = this.inputs.filter(
      (i) => defaultGetter(i) !== fieldValue
    );
    return nonDefaultValues.length === 0;
  }

  /**
   * If `fieldValue` is the default value for all of the `MonoInputConfigStub`s in the
   * input group, returns a string formatted `${fieldValue} [default]`. Otherwise, simply
   * returns `${fieldValue}`
   */
  protected labelFor<T>(fieldValue: T, defaultGetter: (input: K) => T) {
    const isDefault = this.isDefaultValue(fieldValue, defaultGetter);
    return `${fieldValue}${isDefault ? ' [default]' : ''}`;
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
  protected groupValue<T>(
    getterFn: (config: K) => T,
    equalityFn: (a: T, b: T) => boolean = (a, b) => a === b
  ) {
    const vals = this.inputs.map(getterFn);
    const allMatch = vals.filter((v) => !equalityFn(v, vals[0])).length === 0;

    return allMatch ? vals[0] : '<multiple values>';
  }

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
  protected getEligibleValues<T>(
    getterFn: (i: K) => T[],
    equalityFn: (a: T[], b: T[]) => boolean
  ) {
    const eligible = this.groupValue(getterFn, equalityFn);
    return eligible === '<multiple values>'
      ? ([] as T[])
      : getterFn(this.inputs[0]);
  }

  /**
   * Returns a representation of the number for this `BaseInputGroup` which contains additional
   * information depending on `this.statusString` and default values:
   *
   * If this.statusString is default and this.number is default, adds a [default] specifier
   * If this.statusString === 'controlchange', specifies what default parameter the cc is bound to
   * If this.statusString === 'noteon/noteoff', specifies a human-readable note value
   */
  public labelForNumber(n: number) {
    if (this.statusString === '<multiple values>') return n.toString();

    const isDefault =
      this.isDefaultValue(this.statusString, (input) => input.statusString) &&
      this.isDefaultValue(this.number, (input) => input.number);

    let labelTitle;
    if (this.statusString === 'controlchange') {
      labelTitle = this.number === n ? '' : ` - ${CC_BINDINGS.get(n)}`;
    } else if (this.statusString === 'noteon/noteoff') {
      labelTitle = ` - ${stringVal(n)}`;
    } else {
      labelTitle = ``;
    }

    return `${n}${labelTitle}${isDefault ? ' [default]' : ''}`;
  }

  /**
   * Returns a string representation of the `this.channel`, with an added '[default]'specifier if
   * `this.channel` matches the default channel value for all inputs in this group.
   */
  public labelForChannel(c: Channel) {
    return this.labelFor(c, (input) => input.defaults.channel);
  }

  /**
   * Returns a string representation of the `this.statusString`, with an added '[default]'specifier if
   * `this.statusString` matches the default ss value for all inputs in this group.
   */
  public labelForStatsuString(et: string) {
    return this.labelFor(et, (input) => input.defaults.statusString);
  }

  /**
   * Returns a string representation of the `this.response`, with an added '[default]'specifier if
   * `this.response` matches the default response value for all inputs in this group.
   */
  public labelForResponse(response: string) {
    return this.labelFor(response, (input) => input.defaults.response);
  }

  public get isValueCapable() {
    return (
      this.response === 'constant' &&
      this.inputs.filter((i) => i.statusString === 'programchange').length === 0
    );
  }

  public get type() {
    return this.groupValue<string>((i) => i.type);
  }

  public get number() {
    return this.groupValue<number>((c) => c.number);
  }

  public get value() {
    if (this.isValueCapable === false)
      throw new Error(
        'tried to request value of non-value-capable input group'
      );

    return this.groupValue<number>((c) => c.value!);
  }

  public get channel() {
    return this.groupValue<Channel>((c) => c.channel);
  }

  public get statusString() {
    return this.groupValue<StatusString | 'noteon/noteoff'>(
      (c) => c.statusString
    );
  }

  public get response() {
    return this.groupValue((c) => c.outputResponse);
  }

  public get eligibleStateStrings(): (StatusString | 'noteon/noteoff')[] {
    switch (this.type) {
      case '<multiple values>':
        return [];
      case 'pad':
        return this.response === 'constant'
          ? ['noteon', 'noteoff', 'controlchange', 'programchange']
          : ['noteon/noteoff', 'controlchange', 'programchange'];
      case 'pitchbend':
        return ['pitchbend'];
      default:
        return ['noteon', 'noteoff', 'controlchange', 'programchange'];
    }
  }

  public get eligibleResponses(): InputResponse[] {
    switch (this.type) {
      case '<multiple values>':
        return [];
      case 'pad':
        return this.eligibleResponsesForPad();
      case 'pitchbend':
        return ['continuous'];
      default:
        return ['continuous', 'constant'];
    }
  }

  /**
   * Determining eligible responses for a pad is a touch more difficult, as a pad with
   * hardware input 'constant' is capable of both constant and gate toggle should its
   * statusString be set to a multiple-step-capable `StatusString`
   */
  private eligibleResponsesForPad(): InputResponse[] {
    const defaultResponse = this.inputs[0].defaults.response;
    switch (defaultResponse) {
      case 'toggle':
        return ['toggle', 'constant'];
      case 'constant':
        return ['noteon/noteoff', 'controlchange'].includes(this.statusString)
          ? ['toggle', 'constant']
          : ['constant'];
      default:
        return ['gate', 'toggle', 'constant']; // basically case 'gate'
    }
  }
}
