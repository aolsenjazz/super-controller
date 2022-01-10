import { InputDriver } from './input-driver';

export type InputGridDriver = {
  /** Simple identifier, e.g. Main Pads */
  id: string;

  /**
   * Height of input grid, in inches. It can be helpful to add 2 * margin between
   * individual inputs to get a more accurate representation.
   */
  height: number;

  /**
   * Width of input grid, in inches. It can be helpful to add  2* margin between
   * individual inputs to get a more accurate representation.
   */
  width: number;

  /** # of rows containing hardware inputs */
  nRows: number;

  /** # of hardware inputs per row */
  nCols: number;

  /* Distance from left edge of device in inches */
  left: number;

  /* Distance from bottom edge of device in inches */
  bottom: number;

  /* See `InputDriver` */
  inputs: InputDriver[];
};
