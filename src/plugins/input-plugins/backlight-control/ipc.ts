import { ipcMain, IpcMainEvent } from 'electron';

import { Registry } from '@plugins/registry';
import { wp } from '@main/window-provider';
import { Color, FxDriver } from '@shared/driver-types';

import BacklightControlPlugin from '.';

const { MainWindow } = wp;

ipcMain.addListener(
  'backlight-control-update-color',
  (_e: IpcMainEvent, pluginId: string, state: number, color: Color) => {
    const plugin = Registry.get<BacklightControlPlugin>(pluginId);

    if (!plugin) throw new Error(`unable to find plugin for id ${pluginId}`);

    plugin.colorBindings[state] = color;
    plugin.restoreDefaultFx(state);
    plugin.restoreDefaultFxValue(state);

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);

ipcMain.addListener(
  'backlight-control-update-fx',
  (_e: IpcMainEvent, pluginId: string, state: number, fx: FxDriver) => {
    const plugin = Registry.get<BacklightControlPlugin>(pluginId);

    if (!plugin) throw new Error(`unable to find plugin for id ${pluginId}`);

    plugin.fxBindings[state] = fx;
    plugin.restoreDefaultFxValue(state);

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);

ipcMain.addListener(
  'backlight-control-update-fx-value',
  (_e: IpcMainEvent, pluginId: string, state: number, arr: MidiNumber[]) => {
    const plugin = Registry.get<BacklightControlPlugin>(pluginId);

    if (!plugin) throw new Error(`unable to find plugin for id ${pluginId}`);

    plugin.fxValueBindings[state] = arr;

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);
