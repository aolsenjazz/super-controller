import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { INPUT_CONFIG } from '@main/ipc-channels';
import { ipcRenderer } from 'electron';

import { addOnChangeListener } from './common';

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

  getInputConfig(deviceId: string, inputId: string) {
    return ipcRenderer.sendSync(
      INPUT_CONFIG.GET_INPUT_CONFIG,
      deviceId,
      inputId
    );
  },

  /**
   * Subscribe to changes made to input config for given `deviceId` and
   * `inputId`
   */
  onInputConfigChange<T extends InputDTO = InputDTO>(
    deviceId: string,
    inputId: string,
    func: (config: T) => void
  ) {
    const off = addOnChangeListener(
      `device-${deviceId}-input-${inputId}-config`,
      func
    );
    return off;
  },

  getInputConfigs<T extends InputDTO = InputDTO>(
    deviceId: string,
    inputIds: string[]
  ): T[] {
    return ipcRenderer.sendSync('get-input-configs', deviceId, inputIds);
  },
};
