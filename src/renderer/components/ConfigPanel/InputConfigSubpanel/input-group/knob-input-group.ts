import { KnobConfigStub } from '@shared/hardware-config/input-config/knob-config';
import { BaseInputGroup } from './base-input-group';

export class KnobInputGroup extends BaseInputGroup<KnobConfigStub> {
  get isEndlessCapable() {
    const getter = (c: KnobConfigStub) => c.knobType === 'endless';
    const equality = (a: boolean, b: boolean) => {
      return a === true && b === true;
    };
    return this.groupValue(getter, equality);
  }

  get isEndlessMode() {
    const getter = (c: KnobConfigStub) => c.valueType === 'endless';
    return this.groupValue(getter)!;
  }
}
