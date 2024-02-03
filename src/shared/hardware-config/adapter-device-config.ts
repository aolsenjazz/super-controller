import { MidiArray } from '../midi-array';
import { SupportedDeviceConfig } from './supported-device-config';
import { DeviceConfig } from './device-config';

/**
 * TODO: I am once again confronted by the the problem of "why am I implementing
 * supporteddeviceconfig" when devce instanceof SupportedDevice returns false
 */
export class AdapterDeviceConfig
  extends DeviceConfig
  implements SupportedDeviceConfig
{
  child?: SupportedDeviceConfig;

  constructor(
    portName: string,
    driverName: string,
    siblingIndex: number,
    child?: SupportedDeviceConfig
  ) {
    super(portName, driverName, siblingIndex, portName);
    this.child = child;
  }

  setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  // bindingAvailable(
  //   statusString: StatusString | 'noteon/noteoff',
  //   number: number,
  //   channel: Channel
  // ) {
  //   return this.child!.bindingAvailable(statusString, number, channel);
  // }

  applyOverrides(msg: MidiArray) {
    if (this.child) {
      return this.child!.applyOverrides(msg);
    }
    return msg;
  }

  getResponse(msg: MidiArray) {
    if (this.child) {
      return this.child!.getResponse(msg);
    }
    return msg;
  }

  /**
   * Returns the `BaseInputConfig` for given id
   */
  getInputById(id: string) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.id === id) return input;
    }
    return undefined;
  }

  /**
   * Returns the `BaseInputConfig` which is the originator of `msg`. E.g. a CC pad
   * input with number 32 and channel 2 is the originator of the message [178, 32, 127]
   * but not [144, 32, 127] nor [178, 31, 127]
   */
  getOriginatorInput(msg: MidiArray | NumberArrayWithStatus) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.isOriginator(msg)) return input;
    }
    return undefined;
  }

  get inputs() {
    if (this.child) {
      return this.child!.inputs;
    }
    return [];
  }

  public freeze() {
    return {
      ...super.innerFreeze(),
      classNae: this.constructor.name,
      child: this.child?.freeze(),
    };
  }
}
