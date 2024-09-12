import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginIcicle } from '../../base-plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicOverrideIcicle extends PluginIcicle {}

export default class BasicOverridePlugin extends BasePlugin<BasicOverrideIcicle> {
  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze(): BasicOverrideIcicle {
    return {
      ...super.freeze(),
    };
  }

  public applyIcicle(icicle: BasicOverrideIcicle): void {
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
