import { InputDriverWithHandle } from './input-driver-with-handle';
import { BaseInteractiveInputDriver } from './base-interactive-input-driver';

export interface XYDriver extends BaseInteractiveInputDriver {
  type: 'xy';

  x: InputDriverWithHandle;

  y: InputDriverWithHandle;
}
