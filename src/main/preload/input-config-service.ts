import { ipcRenderer } from 'electron';

import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { INPUT_CONFIG } from '@main/ipc/ipc-channels';

import { addOnChangeListener } from './common';

export const InputConfigService = {
  onInputEvent: (
    deviceId: string,
    statusString: StatusString | 'noteon/noteoff',
    channel: Channel,
    number: MidiNumber,
    cb: (msg: NumberArrayWithStatus) => void
  ) => {
    return addOnChangeListener(
      `${deviceId}.${statusString}.${channel}.${number}`,
      cb
    );
  },

  showInputPluginMenu(x: number, y: number, inputId: string) {
    ipcRenderer.send(INPUT_CONFIG.INPUT_PLUGIN_MENU, x, y, inputId);
  },

  removePlugin: (pluginId: string, qualifiedInputId: string) => {
    ipcRenderer.send(INPUT_CONFIG.REMOVE_PLUGIN, pluginId, qualifiedInputId);
  },

  updateInputs(configs: InputDTO[]) {
    ipcRenderer.send(INPUT_CONFIG.UPDATE_INPUT, configs);
  },
};
