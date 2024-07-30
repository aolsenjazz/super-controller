import { InputGridDriver } from './input-grid-driver';
import { KeyboardDriver } from './keyboard-driver';

/* Options obj w/css style-value pairs to make virtual devices look more realistic */
export type DeviceStyle = {
  '--r'?: number /* used to calculate aspect-ratio */;

  /* Radius in `em` or `px` */
  borderTopLeftRadius?: string;

  /* Radius in `em` or `px` */
  borderTopRightRadius?: string;

  /* Radius in `em` or `px` */
  borderBottomLeftRadius?: string;

  /* Radius in `em` or `px` */
  borderBottomRightRadius?: string;
};

export type DeviceDriver = {
  /* Device-reported name */
  readonly name: string;

  /**
   * Is the device a 5-pin device (requires an adapter), an adapter (for 5-pin devices),
   * or a normal device?
   */
  readonly type: 'normal' | 'adapter' | '5pin';

  /* Anonymous.ts is used to represent all non-supporte device drivers. */
  readonly anonymous: boolean;

  /* Width of device in inches */
  readonly width: number;

  /* Height of device in inches */
  readonly height: number;

  /**
   * An array of MIDI messages which need to be sent to the given device in order to
   * take control of the device lights. Not required for most devices.
   */
  readonly controlSequence: NumberArrayWithStatus[];

  /* See `InputGridDriver` */
  readonly inputGrids: InputGridDriver[];

  /* See `DeviceStyle` */
  readonly style: DeviceStyle;

  /* See `KeyboardDriver` */
  readonly keyboard?: KeyboardDriver;

  /**
   * Older devices can only process messages so fast. If necessary, specify the delay in ms
   * in between messages sent to the device
   */
  readonly throttle?: number;
};
