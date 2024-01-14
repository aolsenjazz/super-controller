import { ipcMain, IpcMainEvent } from 'electron';

import { MidiArray } from '@shared/midi-array';
import { Registry } from '@plugins/registry';

import { BasePlugin } from '../base-plugin';
import { ADD_SUSTAIN_TARGET, REMOVE_SUSTAIN_TARGET } from './ipc-channels';

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

// eslint-disable-next-line @typescript-eslint/ban-types
type ShareSustainIcicle = {};

export class ShareSustainPlugin extends BasePlugin<ShareSustainIcicle> {
  public sustainTargets: string[] = [];

  constructor(sustainTargets: string[] = []) {
    super();
    this.sustainTargets = sustainTargets;
  }

  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze() {
    return {};
  }

  public addSustainTarget(targetConfigId: string) {
    this.sustainTargets.push(targetConfigId);
  }

  public removeSustainTarget(targetConfigId: string) {
    this.sustainTargets.splice(this.sustainTargets.indexOf(targetConfigId), 1);
  }

  protected initIpcListeners(): void {}

  public title() {
    return 'Share Sustain';
  }

  public description() {
    return 'Whenever a sustain event is received from the controller, send an identical sustain event through other selected controllers.';
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
