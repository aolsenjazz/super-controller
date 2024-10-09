import { ipcRenderer } from 'electron';

import type { PluginDTO } from '@shared/plugin-core/base-plugin';
import { PLUGIN } from '@main/ipc/ipc-channels';

export const PluginService = {
  togglePower(pluginId: string) {
    ipcRenderer.send(PLUGIN.POWER, pluginId);
  },

  updatePlugin(dto: PluginDTO) {
    ipcRenderer.send(PLUGIN.UPDATE, dto);
  },
};
