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

  addMidiEventListener(
    func: (deviceId: string, msg: NumberArrayWithStatus) => void
  ) {
    return addOnChangeListener(HOST.MIDI_EVENT, func);
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

  /**
   * Invokes `func` whenever the available MIDI ports (hardware and virtual)
   * change. Contains only data available from MIDI connections; without config.
   * Also immediately invokes with current list of devices.
   */
  onConnectedDevicesChange(func: (deviceIds: string[]) => void) {
    const off = addOnChangeListener(HOST.CONNECTED_DEVICES, func);
    ipcRenderer.send(HOST.REQUEST_CONNECTED_DEVICES);
    return off;
  },

  /**
   * Invokes `func` whenever this device changes. As this data is received from the OS,
   * this information is very unlikely to change for any given session. Also immediately
   * invokes with current `DeviceStub`
   */
  onDeviceChange(
    deviceId: string,
    func: (desc: DeviceConnectionDetails | undefined) => void
  ) {
    const off = addOnChangeListener(`device-stub-${deviceId}`, func);
    ipcRenderer.send(HOST.REQUEST_DEVICE_STUB, deviceId);
    return off;
  },

  getDeviceConnectionDetails(
    deviceId: string
  ): DeviceConnectionDetails | undefined {
    return ipcRenderer.sendSync(HOST.GET_CONNECTION_DETAILS, deviceId);
  },

  /**
   * Invokes `func` whenever this input changes state, usually as a result of somebody
   * interacting with the physical controls of a device. Also immediately invokes with
   * the current state.
   */
  onInputChange<T>(
    deviceId: string,
    inputId: string,
    func: (state: T) => void
  ) {
    const off = addOnChangeListener(
      `device-${deviceId}-input-${inputId}-state`,
      func
    );
    ipcRenderer.send(HOST.REQUEST_INPUT_STATE, deviceId, inputId);
    return off;
  },
};
