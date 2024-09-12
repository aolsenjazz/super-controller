import { ipcMain, IpcMainEvent } from 'electron';

import { Registry } from '../../registry';

import ShareSustainPlugin from './index';
import { UPDATE_SHARE_SUSTAIN } from './ipc-channels';
import type { ShareSustainIcicle } from './share-sustain-icicle';

// Applies updates
ipcMain.on(
  UPDATE_SHARE_SUSTAIN,
  (_e: IpcMainEvent, icicle: ShareSustainIcicle) => {
    const plugin = Registry.get<ShareSustainPlugin>(icicle.id);

    if (plugin) plugin.applyIcicle(icicle);
  }
);
