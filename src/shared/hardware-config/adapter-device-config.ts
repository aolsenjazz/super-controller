import { SupportedDeviceConfig } from './supported-device-config';
import { DeviceConfig } from './device-config';
import { MessageProcessorMeta } from '../message-processor';
import { MessageTransport } from '../message-transport';
import { BaseDevicePlugin } from '../../plugins/core/base-device-plugin';
import { BasePlugin } from '../../plugins/core/base-plugin';

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

  public initDefaultPlugins() {
    // no-op
  }

  public async initPluginsFromDTO(
    initPlugin: (id: string) => Promise<BaseDevicePlugin>
  ) {
    const plugins = await super.initPluginsFromDTO(initPlugin);
    let childPlugins: BasePlugin[] = [];

    if (this.child)
      childPlugins = await this.child.initPluginsFromDTO(initPlugin);

    return [...plugins, ...childPlugins];
  }

  public setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    return this.child?.process(msg, meta);
  }

  public init(loopbackTransport: MessageTransport) {
    if (this.child) this.child.init(loopbackTransport);
  }

  public get inputs() {
    if (this.child) {
      return this.child.inputs;
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
