import { ipcMain, IpcMainEvent } from 'electron';

import { Registry } from '@plugins/registry';
import { wp } from '@main/window-provider';

import { TRANSLATOR } from './ipc-channels';
import TranslatorPlugin from '.';

const { MainWindow } = wp;

ipcMain.on(
  TRANSLATOR.UPDATE_OVERRIDE,
  (
    _e: IpcMainEvent,
    pluginId: string,
    sourceString: string,
    override: NumberArrayWithStatus
  ) => {
    const plugin = Registry.get<TranslatorPlugin>(pluginId);

    if (!plugin) throw new Error(`couldnt find ${pluginId}`);

    plugin.overrides[sourceString] = override;

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);

ipcMain.on(
  TRANSLATOR.DELETE_OVERRIDE,
  (_e: IpcMainEvent, pluginId: string, sourceString: string) => {
    const plugin = Registry.get<TranslatorPlugin>(pluginId);

    if (!plugin) throw new Error(`couldnt find ${pluginId}`);

    delete plugin.overrides[sourceString];

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);
