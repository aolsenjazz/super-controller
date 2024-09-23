import { ipcMain, IpcMainEvent } from 'electron';

import { wp } from '@main/window-provider';

import { Registry } from '../../registry';

import ShareSustainPlugin from './index';
import { UPDATE_SHARE_SUSTAIN } from './ipc-channels';

const { MainWindow } = wp;

// Applies updates
ipcMain.on(
  UPDATE_SHARE_SUSTAIN,
  (_e: IpcMainEvent, pluginId: string, sustainTargets: string[]) => {
    const plugin = Registry.get<ShareSustainPlugin>(pluginId);

    if (plugin) {
      plugin.sustainTargets = sustainTargets;
      MainWindow.sendPluginUpdate(pluginId, plugin.toDTO());
    }
  }
);
