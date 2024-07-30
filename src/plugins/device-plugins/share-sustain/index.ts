import { ipcMain, IpcMainEvent } from 'electron';

import { MidiArray } from '@shared/midi-array';
import { Registry } from '@plugins/registry';

import GUI from './gui';

import { BasePlugin, PluginIcicle } from '../../base-plugin';
import { UPDATE_SHARE_SUSTAIN } from './ipc-channels';
import { ImplementsBasePluginStatic } from '../../base-plugin-static';

// Applies updates
ipcMain.on(
  UPDATE_SHARE_SUSTAIN,
  (_e: IpcMainEvent, icicle: ShareSustainIcicle) => {
    const plugin = Registry.get<ShareSustainPlugin>(icicle.id);

    if (plugin) plugin.applyIcicle(icicle);
  }
);

export interface ShareSustainIcicle extends PluginIcicle {
  sustainTargets: string[];
}

@ImplementsBasePluginStatic()
export default class ShareSustainPlugin extends BasePlugin<ShareSustainIcicle> {
  static TITLE() {
    return 'Share Sustain';
  }

  static DESCRIPTION() {
    return 'Whenever a sustain event is received from the controller, send an identical sustain event through other selected controllers.';
  }

  private sustainTargets: string[] = [];

  constructor(sustainTargets: string[] = []) {
    super();
    this.sustainTargets = sustainTargets;
  }

  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze(): ShareSustainIcicle {
    return {
      ...super.freeze(),
      sustainTargets: this.sustainTargets,
    };
  }

  public applyIcicle(icicle: ShareSustainIcicle): void {
    super.applyIcicle(icicle);
    this.sustainTargets = icicle.sustainTargets;
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

  public get GUI() {
    return GUI;
  }

  protected title() {
    return ShareSustainPlugin.TITLE();
  }

  protected description() {
    return ShareSustainPlugin.DESCRIPTION();
  }
}
