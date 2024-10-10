import { ipcMain, IpcMainEvent } from 'electron';

import { PluginDTO } from '@shared/plugin-core/base-plugin';

import { WindowProvider } from '../window-provider';
import { PluginRegistry } from '../plugin-registry';
import { PLUGIN } from './ipc-channels';

const { MainWindow } = WindowProvider;

ipcMain.on(PLUGIN.POWER, (_e: IpcMainEvent, pluginId: string) => {
  const plugin = PluginRegistry.get(pluginId);

  if (!plugin) throw new Error(`Could not locate plugin for id ${pluginId}`);

  plugin.on = !plugin.on;

  MainWindow.sendReduxEvent({
    type: 'plugins/upsertOne',
    payload: plugin.toDTO(),
  });
});

ipcMain.on(PLUGIN.COLLAPSED, (_e: IpcMainEvent, pluginId: string) => {
  const plugin = PluginRegistry.get(pluginId);

  if (!plugin) throw new Error(`Could not locate plugin for id ${pluginId}`);

  plugin.collapsed = !plugin.collapsed;

  MainWindow.sendReduxEvent({
    type: 'plugins/upsertOne',
    payload: plugin.toDTO(),
  });
});

ipcMain.on(PLUGIN.UPDATE, (_e: IpcMainEvent, dto: PluginDTO) => {
  const stalePlugin = PluginRegistry.get(dto.id);

  if (!stalePlugin) throw new Error(`Could not locate plugin for id ${dto.id}`);

  stalePlugin.applyDTO(dto);

  MainWindow.sendReduxEvent({
    type: 'plugins/upsertOne',
    payload: stalePlugin.toDTO(),
  });
});
