import { ipcMain, IpcMainEvent } from 'electron';

import { WindowProvider } from '@main/window-provider';
import { HardwarePortService } from '@main/port-service';
import { PluginRegistry } from '@main/plugin-registry';
import { Color } from '@shared/driver-types/color';
import { FxDriver } from '@shared/driver-types/fx-driver';

import BacklightControlPlugin from '.';

const { MainWindow } = WindowProvider;

ipcMain.addListener(
  'backlight-control-update-color',
  (_e: IpcMainEvent, pluginId: string, state: number, color: Color) => {
    const plugin = PluginRegistry.get<BacklightControlPlugin>(pluginId);

    if (!plugin) throw new Error(`unable to find plugin for id ${pluginId}`);

    plugin.colorBindings[state] = color;
    plugin.restoreDefaultFx(state);
    plugin.restoreDefaultFxValue(state);

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
    // TODO: this is a quick-and-dirty fix that should be replaced with a more nuanced
    // init of just the relevant input
    HardwarePortService.initAllConfiguredPorts();
  }
);

ipcMain.addListener(
  'backlight-control-update-fx',
  (_e: IpcMainEvent, pluginId: string, state: number, fx: FxDriver) => {
    const plugin = PluginRegistry.get<BacklightControlPlugin>(pluginId);

    if (!plugin) throw new Error(`unable to find plugin for id ${pluginId}`);

    plugin.fxBindings[state] = fx;
    plugin.restoreDefaultFxValue(state);

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);

ipcMain.addListener(
  'backlight-control-update-fx-value',
  (_e: IpcMainEvent, pluginId: string, state: number, arr: MidiNumber[]) => {
    const plugin = PluginRegistry.get<BacklightControlPlugin>(pluginId);

    if (!plugin) throw new Error(`unable to find plugin for id ${pluginId}`);

    plugin.fxValueBindings[state] = arr;

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);
