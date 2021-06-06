import { InputDriver } from './input-driver';

export type InputGridStyle = {
  /** Relative to device width. Easily measure with a ruler */
  width: string;

  /** Relative to device height. Measure with ruler, etc */
  height: string;

  /** Postion w.r.t. top of device. Please use percentages */
  top?: string;

  /** Position w.r.t. left of device. Please use percentages */
  left?: string;

  /** Position w.r.t. bottom of device. Please use percentages */
  bottom?: string;

  /** Position w.r.t. right of devices. Please use percentages */
  right?: string;
};

export type InputGridDriver = {
  /** Simple identifier, e.g. Main Pads */
  id: string;

  /** Height of the individual inputs relative to *device width*  */
  height: number;

  /** Width of the individual inputs relative to *device width*  */
  width: number;

  /** # of rows containing hardware inputs */
  nRows: number;

  /** # of hardware inputs per row */
  nCols: number;

  /** See InputGridStyle type */
  style: InputGridStyle;

  inputs: InputDriver[];
};
