import { InteractiveInputDriver } from './interactive-input-driver';

export interface SwitchDriver extends InteractiveInputDriver {
  type: 'switch';
}
