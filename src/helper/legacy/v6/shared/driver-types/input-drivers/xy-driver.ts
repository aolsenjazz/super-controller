import { InputDriverWithHandle } from './input-driver-with-handle';
import { BaseInteractiveInputDriver } from './base-interactive-input-driver';

export interface XYDriver extends BaseInteractiveInputDriver {
  type: 'xy';

  xPolarity: 'unipolar' | 'bipolar';
  yPolarity: 'unipolar' | 'bipolar';

  x: InputDriverWithHandle;

  y: InputDriverWithHandle;
}
