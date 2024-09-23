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
    remoteTransport: MessageTransport,
    _meta: MessageProcessorMeta
  ) {
    const override = this.overrides.find(
      (o) => JSON.stringify(o.source) === JSON.stringify(msg)
    );
    remoteTransport.send(override ? override.override : msg);
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
    };
  }
}
