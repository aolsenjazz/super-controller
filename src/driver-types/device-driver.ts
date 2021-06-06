import { InputGridDriver } from './input-grid-driver';
import { KeyboardDriver } from './keyboard-driver';

export type DeviceStyle = {
  /** Radius in `em` or `px` */
  borderTopLeftRadius?: string;

  /** Radius in `em` or `px` */
  borderTopRightRadius?: string;

  /** Radius in `em` or `px` */
  borderBottomLeftRadius?: string;

  /** Radius in `em` or `px` */
  borderBottomRightRadius?: string;
};

export type DeviceDriver = {
  /** e.g. '3/1' */
  aspectRatio: string;

  /** Device-reported name */
  name: string;

  /** See DeviceStyle type */
  style: DeviceStyle;

  keyboard?: KeyboardDriver;

  inputGrids: InputGridDriver[];
};
