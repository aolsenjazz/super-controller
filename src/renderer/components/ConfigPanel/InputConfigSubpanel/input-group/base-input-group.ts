import { InputResponse } from '@shared/driver-types';
import { MonoInputIcicle } from '@shared/hardware-config/input-config/mono-input-config';
import { CC_BINDINGS, stringVal } from '@shared/util';

/**
 * Returns the output responses the given `MonoInputConfigStub` is capable of.
 * This is determined both by its hardware response, and its currently-configured
 * status string.
 */
function eligibleResponsesForPad(stub: MonoInputIcicle): InputResponse[] {
  const defaultResponse = stub.defaults.response;
  switch (defaultResponse) {
    case 'toggle':
      return ['toggle', 'constant'];
    case 'constant':
      return ['noteon/noteoff', 'controlchange'].includes(stub.statusString)
        ? ['toggle', 'constant']
        : ['constant'];
    default:
      return stub.statusString === 'programchange'
        ? ['constant']
        : ['gate', 'toggle', 'constant']; // basically case 'gate'
  }
}

/**
 * Returns which status strings the given `MonoInputConfigStub` is capable of.
 * This list is determined both the `stub.type` and the currently-configured
 * output response.
 */
function getEligibleStatusStrings(
  stub: MonoInputIcicle
): (StatusString | 'noteon/noteoff')[] {
  switch (stub.type) {
    case 'pad':
      return stub.outputResponse === 'constant'
        ? ['noteon', 'noteoff', 'controlchange', 'programchange']
        : ['noteon/noteoff', 'controlchange', 'programchange'];
    case 'pitchbend':
      return ['pitchbend'];
    default:
      return ['noteon', 'noteoff', 'controlchange', 'programchange'];
  }
}

/**
 * Returns a list of output responses the given `MonoInputConfigStub` is capable of.
 * Determined by both `stub.type` and `stub.statusString`
 */
function getEligibleResponses(stub: MonoInputIcicle): InputResponse[] {
  switch (stub.type) {
    case 'pad':
      return eligibleResponsesForPad(stub);
    case 'pitchbend':
      return ['continuous'];
    default:
      return stub.statusString === 'programchange'
        ? ['constant']
        : ['constant', 'continuous'];
  }
}

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the statusString of several inputs whose `statusString`s are all 'noteon' would be
 * 'noteon'. If one input in the group has a different value, `InputGroup.statusString`
 * would be '<multiple values>'.
 */
export class BaseInputGroup<K extends MonoInputIcicle = MonoInputIcicle> {
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
  ): '<multiple values>' | T {
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
      this.isDefaultValue(
        this.statusString,
        (input) => input.defaults.statusString
      ) && this.isDefaultValue(this.number, (input) => input.defaults.number);

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
  public labelForStatusString(et: string) {
    return this.labelFor(et, (input) => input.defaults.statusString);
  }

  /**
   * Returns a string representation of the `this.response`, with an added '[default]'specifier if
   * `this.response` matches the default response value for all inputs in this group.
   */
  public labelForResponse(response: string) {
    return this.labelFor(response, (input) => input.defaults.response);
  }

  /**
   * Is this input group capable of sending value along with their expected message? E.g.
   * no for pitchbend, programchange messages, non-constant-response messages
   */
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

  /**
   * Returns a single `MidiNumber` value, or '<multiple values>'. Throws if called on
   * a non-value-capable input group.
   */
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

  /**
   * Returns an intersection of all of the eligible status string lists
   */
  public get eligibleStatusStrings() {
    const eligibleLists = this.inputs.map((i) => getEligibleStatusStrings(i));
    return [...new Set([...eligibleLists.flat()])].filter(
      (i) =>
        eligibleLists.filter((i2) => i2.includes(i)).length ===
        eligibleLists.length
    );
  }

  /**
   * Returns an intersection of all of the eligible response lists
   */
  public get eligibleResponses(): InputResponse[] {
    const eligibleLists = this.inputs.map((i) => getEligibleResponses(i));
    return [...new Set([...eligibleLists.flat()])].filter(
      (i) =>
        eligibleLists.filter((i2) => i2.includes(i)).length ===
        eligibleLists.length
    );
  }
}
