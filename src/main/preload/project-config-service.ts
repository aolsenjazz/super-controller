import { CONFIG } from '@main/ipc-channels';
import type { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { ipcRenderer } from 'electron';

export const ProjectConfigService = {
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

  /**
   * Send an updated copy of a device config to the backend.
   */
  updateDevice(config: DeviceConfigDTO) {
    ipcRenderer.send(CONFIG.UPDATE_DEVICE, config);
  },
};
