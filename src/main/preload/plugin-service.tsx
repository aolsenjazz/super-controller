import { ipcRenderer } from 'electron';

import type { PluginDTO } from '@shared/plugin-core/base-plugin';
import { addOnChangeListener } from './common';

export const PluginService = {
  togglePower(pluginId: string) {
    ipcRenderer.send('toggle-power', pluginId);
  },

  addPluginListener<T extends PluginDTO = PluginDTO>(
    id: string,
    func: (dto: T) => void
  ) {
    return addOnChangeListener(`plugin-${id}`, func);
  },

  getPlugin<T extends PluginDTO = PluginDTO>(pluginId: string): T | undefined {
    return ipcRenderer.sendSync(`get-plugin`, pluginId);
  },
};
