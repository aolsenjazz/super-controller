import { KnobDriver } from './knob-driver';
import { PadDriver } from './pad-driver';
import { SwitchDriver } from './switch-driver';
import { InputDriverWithHandle } from './input-driver-with-handle';
import { XYDriver } from './xy-driver';

export type InteractiveInputDriver =
  | KnobDriver
  | PadDriver
  | InputDriverWithHandle
  | SwitchDriver
  | XYDriver;
export { NoninteractiveInputDriver } from './noninteractive-driver';
