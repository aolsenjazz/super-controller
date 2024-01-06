import { MonoInteractiveDriver } from './mono-interactive-driver';

export interface KnobDriver extends MonoInteractiveDriver {
  readonly type: 'knob';

  readonly response: 'continuous';

  readonly knobType: 'endless' | 'absolute';
}
