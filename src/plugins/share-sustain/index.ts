import { ipcMain, IpcMainEvent } from 'electron';

import { MidiArray } from '@shared/midi-array';
import { Registry } from '@plugins/registry';

import { BasePlugin, PluginIcicle } from '../base-plugin';
import { ADD_SUSTAIN_TARGET, REMOVE_SUSTAIN_TARGET } from './ipc-channels';
import { ImplementsBasePluginStatic } from '../base-plugin-static';

// IPC event to be received in the main process
ipcMain.on(
  ADD_SUSTAIN_TARGET,
  (_e: IpcMainEvent, pluginId: string, targetConfigId: string) => {
    const plugin = Registry.get<ShareSustainPlugin>(pluginId);

    if (plugin) plugin.addSustainTarget(targetConfigId);
  }
);

// IPC event to be received in the main process
ipcMain.on(
  REMOVE_SUSTAIN_TARGET,
  (_e: IpcMainEvent, pluginId: string, targetConfigId: string) => {
    const plugin = Registry.get<ShareSustainPlugin>(pluginId);

    if (plugin) plugin.removeSustainTarget(targetConfigId);
  }
);

interface ShareSustainIcicle extends PluginIcicle {
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

  public sustainTargets: string[] = [];

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
      id: this.id,
      title: this.title(),
      sustainTargets: this.sustainTargets,
    };
  }

  public addSustainTarget(targetConfigId: string) {
    this.sustainTargets.push(targetConfigId);
  }

  public removeSustainTarget(targetConfigId: string) {
    this.sustainTargets.splice(this.sustainTargets.indexOf(targetConfigId), 1);
  }

  protected initIpcListeners(): void {}

  public title() {
    return ShareSustainPlugin.TITLE();
  }

  public description() {
    return ShareSustainPlugin.DESCRIPTION();
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
