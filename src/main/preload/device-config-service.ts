import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { ipcRenderer } from 'electron';

import { DEVICE_CONFIG } from '../ipc-channels';

export const DeviceConfigService = {
  showDevicePluginMenu(x: number, y: number, deviceId: string) {
    ipcRenderer.send(DEVICE_CONFIG.DEVICE_PLUGIN_MENU, x, y, deviceId);
  },

  /**
   * Send an updated copy of a device config to the backend.
   */
  updateDevice(config: DeviceConfigDTO) {
    ipcRenderer.send(DEVICE_CONFIG.UPDATE_DEVICE, config);
  },

  /**
   * Removes the specified plugin from the specified device
   */
  removePlugin: (pluginId: string, deviceConfigId: string) => {
    ipcRenderer.send(DEVICE_CONFIG.REMOVE_PLUGIN, pluginId, deviceConfigId);
  },

  /**
   * Tell the main process to intialize a new `SupportedDeviceConfig` and add
   * it to the specified `AdapterDeviceConfig` as its child
   */
  setChild: (configId: string, childId: string) => {
    ipcRenderer.send(DEVICE_CONFIG.SET_CHILD, configId, childId);
  },

  /**
   * Creates a `SupportedDeviceConfig`, `AdapterDeviceConfig`, or `AnonymousDeviceConfig`
   * and adds it to the current project
   */
  addDevice(deviceName: string, siblingIndex: number, driverName?: string) {
    ipcRenderer.send(
      DEVICE_CONFIG.ADD_DEVICE,
      deviceName,
      siblingIndex,
      driverName
    );
  },

  /**
   * Tell the main process to remove this device
   */
  removeDevice(deviceId: string) {
    ipcRenderer.send(DEVICE_CONFIG.REMOVE_DEVICE, deviceId);
  },
};
