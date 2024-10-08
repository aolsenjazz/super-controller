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
    source: NumberArrayWithStatus,
    override: NumberArrayWithStatus
  ) => {
    const plugin = Registry.get<TranslatorPlugin>(pluginId);

    if (!plugin) throw new Error(`couldnt find ${pluginId}`);

    const newOverride = { source, override };
    const newOverrides = plugin.overrides
      .filter((o) => JSON.stringify(o.source) !== JSON.stringify(source))
      .concat(newOverride);

    plugin.overrides = newOverrides;

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);

ipcMain.on(
  TRANSLATOR.DELETE_OVERRIDE,
  (_e: IpcMainEvent, pluginId: string, source: NumberArrayWithStatus) => {
    const plugin = Registry.get<TranslatorPlugin>(pluginId);

    if (!plugin) throw new Error(`couldnt find ${pluginId}`);

    plugin.overrides = plugin.overrides.filter(
      (o) => JSON.stringify(o.source) !== JSON.stringify(source)
    );

    MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
  }
);
