import { ipcMain, IpcMainEvent } from 'electron';

import { Registry } from '@plugins/registry';

import ShareSustainPlugin, { ShareSustainIcicle } from './index';
import { UPDATE_SHARE_SUSTAIN } from './ipc-channels';

// Applies updates
ipcMain.on(
  UPDATE_SHARE_SUSTAIN,
  (_e: IpcMainEvent, icicle: ShareSustainIcicle) => {
    const plugin = Registry.get<ShareSustainPlugin>(icicle.id);

    if (plugin) plugin.applyIcicle(icicle);
  }
);
