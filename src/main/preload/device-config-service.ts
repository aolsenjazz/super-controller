import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { ipcRenderer } from 'electron';

import { CONFIG, DEVICE_CONFIG } from '../ipc-channels';

export const DeviceConfigService = {
  /**
   * Send an updated copy of a device config to the backend.
   */
  updateDevice(config: DeviceConfigDTO) {
    ipcRenderer.send(CONFIG.UPDATE_DEVICE, config);
  },

  removePlugin: (pluginId: string, deviceConfigId: string) => {
    ipcRenderer.send(DEVICE_CONFIG.REMOVE_PLUGIN, pluginId, deviceConfigId);
  },

  setChild: (configId: string, childId: string) => {
    ipcRenderer.send(DEVICE_CONFIG.SET_CHILD, configId, childId);
  },

  /**
   * Creates a `SupportedDeviceConfig`, `AdapterDeviceConfig`, or `AnonymousDeviceConfig`
   * and adds it to the current project
   */
  addDevice(
    deviceName: string,
    siblingIndex: number,
    driverName?: string,
    childName?: string
  ) {
    ipcRenderer.send(
      CONFIG.ADD_DEVICE,
      deviceName,
      siblingIndex,
      driverName,
      childName
    );
  },

  /**
   * Inform that backend that the given device was removed
   */
  removeDevice(deviceId: string) {
    ipcRenderer.send(CONFIG.REMOVE_DEVICE, deviceId);
  },
};
