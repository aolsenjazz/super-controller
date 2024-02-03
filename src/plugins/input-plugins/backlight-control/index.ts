import { MidiArray } from '@shared/midi-array';

import { BasePlugin, PluginIcicle } from '../../base-plugin';
import { ImplementsBasePluginStatic } from '../../base-plugin-static';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BacklightControlIcicle extends PluginIcicle {}

@ImplementsBasePluginStatic()
export default class BacklightControlPlugin extends BasePlugin<BacklightControlIcicle> {
  static TITLE() {
    return 'Backlight Control';
  }

  static DESCRIPTION() {
    return 'Controls the color of the lights for this input.';
  }

  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze(): BacklightControlIcicle {
    return {
      ...super.freeze(),
    };
  }

  public applyIcicle(icicle: BacklightControlIcicle): void {
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
    return BacklightControlPlugin.TITLE();
  }

  protected description() {
    return BacklightControlPlugin.DESCRIPTION();
  }
}
