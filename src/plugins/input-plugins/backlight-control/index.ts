import { MessageProcessorMeta } from '@shared/message-processor';
import { MessageTransport } from '@shared/message-transport';
import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BacklightControlIcicle extends PluginDTO {}

export default class BacklightControlPlugin extends BasePlugin<PluginDTO> {
  public process(
    msg: NumberArrayWithStatus,
    _loopbackTransport: MessageTransport,
    _remoteTransport: MessageTransport,
    _meta: MessageProcessorMeta
  ) {
    // eslint-disable-next-line no-console
    console.log(`${this.title} processing ${msg}`);
  }

  public toDTO(): PluginDTO {
    return {
      ...super.toDTO(),
    };
  }

  public applyIcicle(icicle: PluginDTO): void {
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
