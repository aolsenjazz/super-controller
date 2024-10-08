import { ipcRenderer } from 'electron';

import { DeviceConnectionDetails } from '@shared/device-connection-details';

import { HOST } from '../ipc-channels';
import { addOnChangeListener } from './common';

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
  listenToLoopbackMessages(
    deviceId: string,
    inputId: string,
    func: (msg: NumberArrayWithStatus) => void
  ) {
    return addOnChangeListener(`${deviceId}-${inputId}-loopback`, func);
  },

  onTitleChange: (func: (title: string) => void) => {
    return addOnChangeListener(HOST.TITLE, func);
  },

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
