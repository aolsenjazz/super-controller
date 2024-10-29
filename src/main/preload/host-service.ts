import { ipcRenderer } from 'electron';

import { DeviceConnectionDetails } from '@shared/device-connection-details';

import { HOST } from '../ipc/ipc-channels';

type Host =
  | 'linux'
  | 'win32'
  | 'sunos'
  | 'openbsd'
  | 'freebsd'
  | 'darwin'
  | 'aix';

/**
 * Expose data re. the host (usually the OS + hardware) to the renderer process
 */
export const HostService = {
  /**
   * Returns a string representation of the current operating system
   */
  getHost: () => {
    return ipcRenderer.sendSync(HOST.OS, process.platform) as Host;
  },

  /**
   * Tells the host that the client would like to request the creation of a new driver
   */
  sendDeviceRequest: (deviceName?: string) => {
    ipcRenderer.send(HOST.REQUEST, deviceName);
  },

  getConnectedDevices(): DeviceConnectionDetails[] {
    return ipcRenderer.sendSync(HOST.GET_CONNECTED_DEVICES);
  },
};
