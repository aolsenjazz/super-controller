import { InputDriverWithHandle } from './input-driver-with-handle';
import { InteractiveInputDriver } from './interactive-input-driver';

export interface XYDriver extends InteractiveInputDriver {
  type: 'xy';

  x: InputDriverWithHandle;

  y: InputDriverWithHandle;
}
