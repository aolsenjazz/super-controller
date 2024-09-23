import { SupportedDeviceConfig } from './supported-device-config';
import { DeviceConfig } from './device-config';
import { MessageTransport } from '../message-transport';
import { MessageProcessorMeta } from '../message-processor';

export class AdapterDeviceConfig extends DeviceConfig {
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

  process(
    msg: NumberArrayWithStatus,
    loopbackTransport: MessageTransport,
    remoteTransport: MessageTransport,
    meta: MessageProcessorMeta
  ) {
    this.child?.process(msg, loopbackTransport, remoteTransport, meta);
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
  getOriginatorInput(msg: NumberArrayWithStatus) {
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

  public toDTO() {
    return {
      ...super.stub(),
      className: this.constructor.name,
      child: this.child?.toDTO(),
    };
  }
}
