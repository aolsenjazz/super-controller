import { SupportedDeviceConfig } from './supported-device-config';
import { DeviceConfig } from './device-config';
import { MessageProcessorMeta } from '../message-processor';
import { MessageTransport } from '../message-transport';

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

  public setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  // bindingAvailable(
  //   statusString: StatusString | 'noteon/noteoff',
  //   number: number,
  //   channel: Channel
  // ) {
  //   return this.child!.bindingAvailable(statusString, number, channel);
  // }

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    return this.child?.process(msg, meta);
  }

  public init(loopbackTransport: MessageTransport) {
    if (this.child) this.child.init(loopbackTransport);
  }

  /**
   * Returns the `BaseInputConfig` for given id
   */
  public getInputById(id: string) {
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
  public getOriginatorInput(msg: NumberArrayWithStatus) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.isOriginator(msg)) return input;
    }
    return undefined;
  }

  public get inputs() {
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
      type: 'adapter' as const,
    };
  }
}
