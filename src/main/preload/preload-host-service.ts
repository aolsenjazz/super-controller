import { DeviceStub } from '@shared/device-stub';
import { ipcRenderer } from 'electron';

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
export const hostService = {
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
   * Sets a callback function to be invoked when the host receives MIDI data from a
   * MIDI port
   */
  onMessage: (deviceId: string, func: (msg: MidiTuple) => void) => {
    return addOnChangeListener(`${deviceId}-message`, func);
  },

  /**
   * Invokes `func` whenever the available MIDI ports (hardware and virtual)
   * change. Contains only data available from MIDI connections; without config.
   * Also immediately invokes with current list of devices.
   */
  onConnectedDevicesChange(func: (stubs: DeviceStub[]) => void) {
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
    func: (desc: DeviceStub | undefined) => void
  ) {
    const off = addOnChangeListener(`device-stub-${deviceId}`, func);
    ipcRenderer.send(HOST.REQUEST_DEVICE_STUB, deviceId);
    return off;
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
