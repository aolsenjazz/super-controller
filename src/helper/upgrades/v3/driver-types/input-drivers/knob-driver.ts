import { InteractiveInputDriver } from './interactive-input-driver';

export interface KnobDriver extends InteractiveInputDriver {
  readonly type: 'knob';

  readonly response: 'continuous';

  readonly knobType: 'endless' | 'absolute';
}
