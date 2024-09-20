import { MessageProcessorMeta } from '@shared/message-processor';
import { MessageTransport } from '@shared/message-transport';
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

  public process(
    msg: NumberArrayWithStatus,
    _loopbackTransport: MessageTransport,
    _remoteTransport: MessageTransport,
    _meta: MessageProcessorMeta
  ) {
    // eslint-disable-next-line no-console
    console.log(`${this.title} processing ${msg}`);
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
    };
  }
}
