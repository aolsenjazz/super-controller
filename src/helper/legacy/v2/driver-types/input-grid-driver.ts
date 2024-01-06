import { InputDrivers } from './input-drivers';

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

  // TODO: thhis only appears in the JS10 whatever driver. is thihs realy needed?
  readonly style?: {
    width?: string;
    height?: string;
    top?: string;
    left?: string;
  };

  /* See `InputDriver` */
  readonly inputs: InputDrivers[];
};
