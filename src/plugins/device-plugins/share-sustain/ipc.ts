import { ipcMain, IpcMainEvent } from 'electron';

import { WindowProvider } from '@main/window-provider';
import { PluginRegistry } from '@main/plugin-registry';

import ShareSustainPlugin from './index';
import { UPDATE_SHARE_SUSTAIN } from './ipc-channels';

const { MainWindow } = WindowProvider;

// Applies updates
ipcMain.on(
  UPDATE_SHARE_SUSTAIN,
  (_e: IpcMainEvent, pluginId: string, sustainTargets: string[]) => {
    const plugin = PluginRegistry.get<ShareSustainPlugin>(pluginId);

    if (plugin) {
      plugin.sustainTargets = sustainTargets;
      MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
    }
  }
);
