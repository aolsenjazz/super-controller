import { ipcRenderer } from 'electron';

import type { PluginDTO } from '@shared/plugin-core/base-plugin';

export const pluginService = {
  updatePlugin(deviceId: string, icicle: PluginDTO) {
    ipcRenderer.send('update-plugin', deviceId, icicle);
  },
};

export type PluginService = typeof pluginService;
