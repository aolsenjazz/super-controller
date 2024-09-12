import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginIcicle } from '@shared/plugin-core/base-plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BacklightControlIcicle extends PluginIcicle {}

export default class BacklightControlPlugin extends BasePlugin<PluginIcicle> {
  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze(): PluginIcicle {
    return {
      ...super.freeze(),
    };
  }

  public applyIcicle(icicle: PluginIcicle): void {
    super.applyIcicle(icicle);
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }

  public get aggregateCapable() {
    return true;
  }
}
