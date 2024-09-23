import { MessageProcessorMeta } from '@shared/message-processor';
import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';
import { MidiEventOverride } from './midi-event-override';

export interface TranslatorDTO extends PluginDTO {
  overrides: MidiEventOverride[];
}

export default class TranslatorPlugin extends BasePlugin<TranslatorDTO> {
  overrides: MidiEventOverride[] = [];

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }

  public process(msg: NumberArrayWithStatus, _meta: MessageProcessorMeta) {
    const override = this.overrides.find(
      (o) => JSON.stringify(o.source) === JSON.stringify(msg)
    );
    return override ? override.override : msg;
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
    };
  }
}
