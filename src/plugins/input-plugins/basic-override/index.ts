import { MessageProcessorMeta } from '@shared/message-processor';
import { MessageTransport } from '@shared/message-transport';
import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicOverrideIcicle extends PluginDTO {}

export default class BasicOverridePlugin extends BasePlugin<BasicOverrideIcicle> {
  public process(
    msg: NumberArrayWithStatus,
    _loopbackTransport: MessageTransport,
    _remoteTransport: MessageTransport,
    _meta: MessageProcessorMeta
  ) {
    // eslint-disable-next-line no-console
    console.log(`${this.title} processing ${msg}`);
  }

  public freeze(): BasicOverrideIcicle {
    return {
      ...super.toDTO(),
    };
  }

  public applyIcicle(icicle: BasicOverrideIcicle): void {
    super.applyDTO(icicle);
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
