import { NoninteractiveInputDriver } from './noninteractive-driver';
import { KnobDriver } from './knob-driver';
import { PadDriver } from './pad-driver';
import { SwitchDriver } from './switch-driver';
import { InputDriverWithHandle } from './input-driver-with-handle';
import { MonoInteractiveDriver } from './mono-interactive-driver';
import { XYDriver } from './xy-driver';
import { InteractiveInputDriver } from './interactive-input-driver';

export { InputDriver, InputType, InputShape } from './input-driver';
export {
  MonoInteractiveDriver,
  InputResponse,
} from './mono-interactive-driver';

// TODO: this is smelly
type InputDrivers =
  | NoninteractiveInputDriver
  | KnobDriver
  | InputDriverWithHandle
  | PadDriver
  | MonoInteractiveDriver
  | XYDriver
  | SwitchDriver;

// TODO: also smelly
type InteractiveInputDrivers =
  | KnobDriver
  | PadDriver
  | XYDriver
  | SwitchDriver
  | InputDriverWithHandle;

export {
  InputDrivers,
  NoninteractiveInputDriver,
  KnobDriver,
  InteractiveInputDriver,
  InputDriverWithHandle,
  PadDriver,
  SwitchDriver,
  InteractiveInputDrivers,
  XYDriver,
};
