import { InputDriver } from './input-driver';

export interface NoninteractiveInputDriver extends InputDriver {
  /* Can the input be overridden? `false` if the input does not transmit data to clients */
  readonly interactive: false;

  /* If input has a handle (think wheel or XY pad), width in inches */
  readonly handleWidth?: number;

  /* If input has a handle (think wheel, or XY pad), height in inches */
  readonly handleHeight?: number;
}
