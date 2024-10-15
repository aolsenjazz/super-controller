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

  MainWindow.upsertPlugin(plugin.toDTO());
});

ipcMain.on(PLUGIN.COLLAPSED, (_e: IpcMainEvent, pluginId: string) => {
  const plugin = PluginRegistry.get(pluginId);

  if (!plugin) throw new Error(`Could not locate plugin for id ${pluginId}`);

  plugin.collapsed = !plugin.collapsed;

  MainWindow.upsertPlugin(plugin.toDTO());
});

ipcMain.on(PLUGIN.UPDATE, (_e: IpcMainEvent, dto: PluginDTO) => {
  const plugin = PluginRegistry.get(dto.id);

  if (!plugin) throw new Error(`Could not locate plugin for id ${dto.id}`);

  plugin.applyDTO(dto);

  MainWindow.upsertPlugin(plugin.toDTO());
});

ipcMain.on(PLUGIN.GET_ALL_PLUGINS, (e: IpcMainEvent) => {
  const plugins = PluginRegistry.getAll().map((p) => p.toDTO());
  e.returnValue = plugins;
});
