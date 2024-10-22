import { NoninteractiveInputDriver } from './input-drivers';
import { InputDriverWithHandle } from './input-drivers/input-driver-with-handle';
import { KnobDriver } from './input-drivers/knob-driver';
import { MonoInteractiveDriver } from './input-drivers/mono-interactive-driver';
import { PadDriver } from './input-drivers/pad-driver';
import { SwitchDriver } from './input-drivers/switch-driver';
import { XYDriver } from './input-drivers/xy-driver';

export type InputGridDriver = {
  /** Simple identifier, e.g. Main Pads */
  readonly id: string;

  /**
   * Height of input grid, in inches. It can be helpful to add 2 * margin between
   * individual inputs to get a more accurate representation.
   */
  readonly height: number;

  /**
   * Width of input grid, in inches. It can be helpful to add  2* margin between
   * individual inputs to get a more accurate representation.
   */
  readonly width: number;

  /** # of rows containing hardware inputs */
  readonly nRows: number;

  /** # of hardware inputs per row */
  readonly nCols: number;

  /* Distance from left edge of device in inches */
  readonly left: number;

  /* Distance from bottom edge of device in inches */
  readonly bottom: number;

  /* See `InputDriver` */

  readonly inputs: (
    | NoninteractiveInputDriver
    | KnobDriver
    | MonoInteractiveDriver
    | InputDriverWithHandle
    | PadDriver
    | XYDriver
    | SwitchDriver
  )[];
};
