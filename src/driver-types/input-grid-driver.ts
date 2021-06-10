import { InputDriver } from './input-driver';

export type InputGridDriver = {
  /** Simple identifier, e.g. Main Pads */
  id: string;

  height: number;

  width: number;

  /** # of rows containing hardware inputs */
  nRows: number;

  /** # of hardware inputs per row */
  nCols: number;

  left: number;

  bottom: number;

  inputs: InputDriver[];
};
