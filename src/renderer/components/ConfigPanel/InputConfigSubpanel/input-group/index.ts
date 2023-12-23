import { KnobConfigStub } from '@shared/hardware-config/input-config/knob-config';
import { ColorCapableInputConfigStub } from '@shared/hardware-config/input-config/light-capable-input-config';
import { MonoInputConfigStub } from '@shared/hardware-config/input-config/mono-input-config';
import { BaseInputGroup } from './base-input-group';
import { ColorCapableInputGroup } from './color-capable-input-group';
import { KnobInputGroup } from './knob-input-group';

export function createInputGroup(inputs: MonoInputConfigStub[]) {
  const baseGroup = new BaseInputGroup(inputs);

  switch (baseGroup.type) {
    case 'knob':
      return new KnobInputGroup(inputs as KnobConfigStub[]);
    case 'pad':
      return new ColorCapableInputGroup(
        inputs as ColorCapableInputConfigStub[]
      );
    default:
      return baseGroup;
  }
}
