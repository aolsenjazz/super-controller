import { ipcRenderer } from 'electron';

import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { INPUT_CONFIG } from '@main/ipc-channels';

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

  removePlugin: (pluginId: string, deviceConfigId: string, inputId: string) => {
    ipcRenderer.send(
      INPUT_CONFIG.REMOVE_PLUGIN,
      pluginId,
      deviceConfigId,
      inputId
    );
  },

  updateInputs(configs: InputDTO[]) {
    ipcRenderer.send(INPUT_CONFIG.UPDATE_INPUT, configs);
  },
};
