import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginIcicle } from '../../base-plugin';
import { ImplementsBasePluginStatic } from '../../base-plugin-static';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BasicOverrideIcicle extends PluginIcicle {}

@ImplementsBasePluginStatic()
export default class BasicOverridePlugin extends BasePlugin<BasicOverrideIcicle> {
  static TITLE() {
    return 'Basic Override';
  }

  static DESCRIPTION() {
    return 'Basic controls to modify the messages sent by this input.';
  }

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

  protected title() {
    return BasicOverridePlugin.TITLE();
  }

  protected description() {
    return BasicOverridePlugin.DESCRIPTION();
  }
}
