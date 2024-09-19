import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';
import { MidiEventOverride } from './midi-event-override';

export interface TranslatorDTO extends PluginDTO {
  overrides: MidiEventOverride[];
}

export default class TranslatorPlugin extends BasePlugin<TranslatorDTO> {
  overrides: MidiEventOverride[] = [];

  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }

  public toDTO(): TranslatorDTO {
    return {
      ...super.toDTO(),
      overrides: this.overrides,
    };
  }
}
