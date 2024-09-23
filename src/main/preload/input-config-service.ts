import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { ipcRenderer } from 'electron';

import { INPUT_CONFIG } from '../ipc-channels';

export const InputConfigService = {
  removePlugin: (pluginId: string, deviceConfigId: string, inputId: string) => {
    ipcRenderer.send(
      INPUT_CONFIG.REMOVE_PLUGIN,
      pluginId,
      deviceConfigId,
      inputId
    );
  },

  updateInputs(deviceId: string, configs: InputDTO[]) {
    ipcRenderer.send(INPUT_CONFIG.UPDATE_INPUT, deviceId, configs);
  },
};
