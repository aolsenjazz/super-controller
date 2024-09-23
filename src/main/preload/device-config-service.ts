import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { ipcRenderer } from 'electron';

import { CONFIG, DEVICE_CONFIG } from '../ipc-channels';
import { addOnChangeListener } from './common';

export const DeviceConfigService = {
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
    ipcRenderer.send(CONFIG.GET_INPUT_CONFIG, deviceId, inputId);
    return off;
  },

  /**
   * Send an updated copy of a device config to the backend.
   */
  updateDevice(config: DeviceConfigDTO) {
    ipcRenderer.send(CONFIG.UPDATE_DEVICE, config);
  },

  getInputConfigs<T extends InputDTO = InputDTO>(
    deviceId: string,
    inputIds: string[]
  ): T[] {
    return ipcRenderer.sendSync('get-input-configs', deviceId, inputIds);
  },

  requestInputConfigs(deviceId: string, inputIds: string[]) {
    ipcRenderer.send(CONFIG.REQUEST_INPUT_CONFIG_STUB, deviceId, inputIds);
  },

  removePlugin: (pluginId: string, deviceConfigId: string) => {
    ipcRenderer.send(DEVICE_CONFIG.REMOVE_PLUGIN, pluginId, deviceConfigId);
  },

  getConfiguredDevices: () => {
    return ipcRenderer.sendSync(CONFIG.GET_CONFIGURED_DEVICES) as string[];
  },

  onConfiguredDevicesChange: (func: (deviceConfigs: string[]) => void) => {
    return addOnChangeListener(CONFIG.CONFIGURED_DEVICES, func);
  },

  /**
   * Subscribe to changes to a config for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onDeviceConfigChange(
    deviceId: string,
    func: (desc: DeviceConfigDTO | undefined) => void
  ) {
    return addOnChangeListener(`device-config-stub-${deviceId}`, func);
  },

  getDeviceConfig(deviceId: string) {
    return ipcRenderer.sendSync(CONFIG.GET_DEVICE_CONFIG, deviceId) as
      | DeviceConfigDTO
      | undefined;
  },
};
