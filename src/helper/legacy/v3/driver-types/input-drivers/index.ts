import { NoninteractiveInputDriver } from './noninteractive-driver';
import { KnobDriver } from './knob-driver';
import { PadDriver } from './pad-driver';
import { SwitchDriver } from './switch-driver';
import { InputDriverWithHandle } from './input-driver-with-handle';

export { InputDriver, InputType, InputShape } from './input-driver';
export {
  InteractiveInputDriver,
  InputResponse,
} from './interactive-input-driver';

type InputDrivers =
  | NoninteractiveInputDriver
  | KnobDriver
  | InputDriverWithHandle
  | PadDriver
  | SwitchDriver;

type InteractiveInputDrivers =
  | KnobDriver
  | PadDriver
  | SwitchDriver
  | InputDriverWithHandle;

export {
  InputDrivers,
  NoninteractiveInputDriver,
  KnobDriver,
  InputDriverWithHandle,
  PadDriver,
  SwitchDriver,
  InteractiveInputDrivers,
};
