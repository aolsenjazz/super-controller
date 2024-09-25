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
    return addOnChangeListener(
      `device-${deviceId}-input-${inputId}-config`,
      func
    );
  },

  /**
   * Subscribe to changes made to any number of input configs
   */
  addInputsChangeListener<T extends InputDTO = InputDTO>(
    func: (inputDTOs: T[]) => void
  ) {
    return addOnChangeListener(INPUT_CONFIG.INPUTS_CHANGE, func);
  },

  getInputConfigs<T extends InputDTO = InputDTO>(
    deviceId: string,
    inputIds: string[]
  ): T[] {
    return ipcRenderer.sendSync(
      INPUT_CONFIG.GET_INPUT_CONFIGS,
      deviceId,
      inputIds
    );
  },
};
