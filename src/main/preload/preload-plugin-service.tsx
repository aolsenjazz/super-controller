import { ipcRenderer } from 'electron';

import type { PluginIcicle } from '@plugins/base-plugin';

export const pluginService = {
  updatePlugin(deviceId: string, icicle: PluginIcicle) {
    ipcRenderer.send('update-plugin', deviceId, icicle);
  },
};

export type PluginService = typeof pluginService;
