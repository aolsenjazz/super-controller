import { InputGridDriver } from './input-grid-driver';
import { KeyboardDriver } from './keyboard-driver';

/**
 * Human-readable representation of a midi message to be sent devices upon
 * intialization. Running a control sequence relinquishes control of device
 * lights, though not all device require control sequences to achieve this.
 *
 *
 * TODO: this is an illogical order. why wouldn't I just use midi arrays?
 * [status, number, value, channel]
 */
type ControlSequenceMessage = [StatusString, MidiNumber, MidiNumber, Channel];

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
  name: string;

  /**
   * Is the device a 5-pin device (requires an adapter), an adapter (for 5-pin devices),
   * or a normal device?
   */
  type: 'normal' | 'adapter' | '5pin';

  /* Width of device in inches */
  width: number;

  /* Height of device in inches */
  height: number;

  /**
   * Older devices can only process messages so fast. If necessary, specify the delay in ms
   * in between messages sent to the device
   */
  throttle?: number;

  /* See `DeviceStyle` */
  style: DeviceStyle;

  /* See `InputGridDriver` */
  inputGrids: InputGridDriver[];

  /**
   * There only exists 1 anonmyous driver, however when the Anonymous driver is loaded,
   * its name is overwritten, so this is to clarify
   */
  anonymous?: boolean;

  /* See `KeyboardDriver` */
  keyboard?: KeyboardDriver;

  /* See `ControlSequenceMessage` */
  controlSequence?: ControlSequenceMessage[];
};
