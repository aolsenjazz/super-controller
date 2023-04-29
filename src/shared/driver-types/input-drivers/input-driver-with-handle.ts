import { MonoInteractiveDriver } from './mono-interactive-driver';

export interface InputDriverWithHandle extends MonoInteractiveDriver {
  readonly type: 'wheel' | 'slider' | 'xy';

  readonly response: 'continuous';

  readonly inverted: boolean;

  readonly horizontal: boolean;

  readonly handleWidth: number;

  readonly handleHeight: number;
}
