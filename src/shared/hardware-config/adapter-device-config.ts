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
