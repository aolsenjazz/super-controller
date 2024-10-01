import { MessageProcessorMeta } from '@shared/message-processor';
import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicOverrideIcicle extends PluginDTO {}

export default class BasicOverridePlugin extends BasePlugin<BasicOverrideIcicle> {
  public process(msg: NumberArrayWithStatus, _meta: MessageProcessorMeta) {
    return msg;
  }

  public freeze(): BasicOverrideIcicle {
    return {
      ...super.toDTO(),
    };
  }

  public applyIcicle(icicle: BasicOverrideIcicle): void {
    super.applyDTO(icicle);
  }

  public init() {
    // noop
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
