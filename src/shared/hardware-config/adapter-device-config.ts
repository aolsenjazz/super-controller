import { SupportedDeviceConfig } from './supported-device-config';
import { DeviceConfig } from './device-config';
import { MessageProcessorMeta } from '../message-processor';
import { MessageTransport } from '../message-transport';
import { BaseDevicePlugin } from '../../plugins/core/base-device-plugin';
import { BasePlugin } from '../../plugins/core/base-plugin';
import { getQualifiedInputId } from '../util';
import { idForMsg } from '../midi-util';

export class AdapterDeviceConfig extends DeviceConfig {
  child?: SupportedDeviceConfig;

  constructor(
    portName: string,
    driverName: string,
    siblingIndex: number,
    child?: SupportedDeviceConfig,
  ) {
    super(portName, driverName, siblingIndex, portName);
    this.child = child;
  }

  public initDefaultPlugins() {
    // no-op
  }

  public initPluginsFromDTO(initPlugin: (id: string) => BaseDevicePlugin) {
    let childPlugins: BasePlugin[] = [];

    if (this.child) childPlugins = this.child.initPluginsFromDTO(initPlugin);

    return [...childPlugins];
  }

  public setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  /**
   * Interestingly, at this point, we're not event calling the child for anything here.
   * Makes one wonder what the relationship between adapters and children is, and
   * whether or not DeviceConfigs need to be aware of their own inputs at runtime.
   */
  public process(msg: NumberArrayWithStatus, meta: MessageProcessorMeta) {
    if (this.child) {
      const message = super.process(msg, meta)!;
      const messageIdentifier = idForMsg(msg, false);

      const input = meta.inputProvider.get(
        getQualifiedInputId(this.id, messageIdentifier),
      );

      return input ? input.process(message, meta) : message;
    }

    return msg;
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
