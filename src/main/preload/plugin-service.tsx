import { ipcRenderer } from 'electron';

import type { PluginDTO } from '@plugins/core/base-plugin';
import { PLUGIN } from '@main/ipc/ipc-channels';

export const PluginService = {
  togglePower(pluginId: string) {
    ipcRenderer.send(PLUGIN.POWER, pluginId);
  },

  toggleCollapsed(pluginId: string) {
    ipcRenderer.send(PLUGIN.COLLAPSED, pluginId);
  },

  updatePlugin(dto: PluginDTO) {
    ipcRenderer.send(PLUGIN.UPDATE, dto);
  },

  getAllPlugins(): PluginDTO[] {
    return ipcRenderer.sendSync(PLUGIN.GET_ALL_PLUGINS);
  },
};
