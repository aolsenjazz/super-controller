import { ipcMain, IpcMainEvent } from 'electron';

import {
  getDeviceManifests,
  getInputManifests,
  importDeviceSubcomponent,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import { Registry } from '@plugins/registry';

import { wp } from './window-provider';

ipcMain.on('get-plugin', (e: IpcMainEvent, pluginId: string) => {
  const plugin = Registry.get(pluginId);
  e.returnValue = plugin?.toDTO();
});

ipcMain.on('toggle-power', (_e: IpcMainEvent, pluginId: string) => {
  const plugin = Registry.get(pluginId);

  if (plugin) {
    plugin.on = !plugin.on;
    wp.MainWindow.sendPluginUpdate(plugin.id, plugin.toDTO());
  }
});

// Load main process device plugin IPC listeners
getDeviceManifests()
  .then((manifests) => {
    manifests.forEach((m) => {
      importDeviceSubcomponent(m.title, 'ipc');
    });
    return null;
  })
  .catch((e) => {
    throw new Error(`failed to load device manifests: ${e}`);
  });

// Load main process input plugin IPC listeners
getInputManifests()
  .then((manifests) => {
    manifests.forEach((m) => {
      importInputSubcomponent(m.title, 'ipc');
    });
    return null;
  })
  .catch((e) => {
    throw new Error(`failed to load input manifests: ${e}`);
  });
