import { ipcRenderer } from 'electron';

import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { INPUT_CONFIG } from '@main/ipc/ipc-channels';

export const InputConfigService = {
  showInputPluginMenu(x: number, y: number, inputId: string) {
    ipcRenderer.send(INPUT_CONFIG.INPUT_PLUGIN_MENU, x, y, inputId);
  },

  removePlugin: (pluginId: string, qualifiedInputId: string) => {
    ipcRenderer.send(INPUT_CONFIG.REMOVE_PLUGIN, pluginId, qualifiedInputId);
  },

  updateInputs(configs: InputDTO[]) {
    ipcRenderer.send(INPUT_CONFIG.UPDATE_INPUT, configs);
  },

  getInputConfigs(): InputDTO[] {
    return ipcRenderer.sendSync(INPUT_CONFIG.GET_INPUT_CONFIGS);
  },
};
