import { MidiArray } from '@shared/midi-array';

import GUI from './gui';

import { BasePlugin, PluginIcicle } from '../../base-plugin';
import { ImplementsBasePluginStatic } from '../../base-plugin-static';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BacklightControlIcicle extends PluginIcicle {}

@ImplementsBasePluginStatic()
export default class BacklightControlPlugin extends BasePlugin<PluginIcicle> {
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

  public get GUI() {
    return GUI;
  }

  protected title() {
    return BacklightControlPlugin.TITLE();
  }

  protected description() {
    return BacklightControlPlugin.DESCRIPTION();
  }
}
