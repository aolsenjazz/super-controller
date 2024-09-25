import { MessageProcessorMeta } from '@shared/message-processor';
import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';
import { toString } from './util';

export interface TranslatorDTO extends PluginDTO {
  overrides: Record<string, NumberArrayWithStatus | undefined>;
}

export default class TranslatorPlugin extends BasePlugin<TranslatorDTO> {
  overrides: Record<string, NumberArrayWithStatus | undefined> = {};

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }

  public process(msg: NumberArrayWithStatus, _meta: MessageProcessorMeta) {
    const override = this.overrides[toString(msg)];
    return override || msg;
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
    };
  }
}
