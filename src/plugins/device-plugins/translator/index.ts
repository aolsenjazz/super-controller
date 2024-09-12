import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginIcicle } from '../../base-plugin';

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-interface
interface TranslatorIcicle extends PluginIcicle {}

export default class TranslatorPlugin extends BasePlugin<TranslatorIcicle> {
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

  public get aggregateCapable() {
    return false;
  }
}
