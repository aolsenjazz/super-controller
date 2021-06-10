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
  /** Device-reported name */
  name: string;

  width: number;

  height: number;

  style: DeviceStyle;

  keyboard?: KeyboardDriver;

  inputGrids: InputGridDriver[];
};
