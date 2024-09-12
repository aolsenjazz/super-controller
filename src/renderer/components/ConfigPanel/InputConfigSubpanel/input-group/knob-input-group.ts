import { BaseInputGroup } from './base-input-group';

/**
 * A pseudo-`InputConfig` used to show the values of multiple inputs in a group.
 *
 * E.g. the statusString of several inputs whose `statusString`s are all 'noteon' would be
 * 'noteon'. If one input in the group has a different value, `InputGroup.statusString`
 * would be '<multiple values>'.
 *
 * Extends `BaseInputGroup`, adding support for additional knob fields
 */
export class KnobInputGroup extends BaseInputGroup {
  get isEndlessCapable() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getter = (c: any) => c.defaults.knobType === 'endless';
    const equality = (a: boolean, b: boolean) => {
      return a === true && b === true;
    };
    return this.groupValue(getter, equality);
  }

  get isEndlessMode() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getter = (c: any) => c.valueType === 'endless';
    return this.groupValue(getter)!;
  }
}
