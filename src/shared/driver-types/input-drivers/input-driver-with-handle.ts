import { InteractiveInputDriver } from './interactive-input-driver';

export interface InputDriverWithHandle extends InteractiveInputDriver {
  readonly type: 'wheel' | 'slider' | 'xy';

  readonly response: 'continuous';

  readonly inverted: boolean;

  readonly horizontal: boolean;

  readonly handleWidth: number;

  readonly handleHeight: number;
}
