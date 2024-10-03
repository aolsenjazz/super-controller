import { ipcMain, IpcMainEvent } from 'electron';

import { WindowProvider } from '@main/window-provider';
import { PluginRegistry } from '@main/plugin-registry';

import { TRANSLATOR } from './ipc-channels';
import TranslatorPlugin from '.';

const { MainWindow } = WindowProvider;

ipcMain.on(
  TRANSLATOR.UPDATE_OVERRIDE,
  (
    _e: IpcMainEvent,
    pluginId: string,
    sourceString: string,
    override: NumberArrayWithStatus
  ) => {
    const plugin = PluginRegistry.get<TranslatorPlugin>(pluginId);

    if (!plugin) throw new Error(`couldnt find ${pluginId}`);

    plugin.overrides[sourceString] = override;

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);

ipcMain.on(
  TRANSLATOR.DELETE_OVERRIDE,
  (_e: IpcMainEvent, pluginId: string, sourceString: string) => {
    const plugin = PluginRegistry.get<TranslatorPlugin>(pluginId);

    if (!plugin) throw new Error(`couldnt find ${pluginId}`);

    delete plugin.overrides[sourceString];

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);
