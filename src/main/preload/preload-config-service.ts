import { ipcRenderer, IpcRendererEvent } from 'electron';

import { DeviceConfigStub } from '@shared/hardware-config/device-config';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';

import { CONFIG, HOST } from '../ipc-channels';

/**
 * Generic wrapper around ipcRenderer.on() and ipcRenderer.removeListener()
 *
 * @param channel The channel data is being received on
 * @param func The callback function to be invoked once data is received
 */
function addOnChangeListener(
  channel: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  func: (...args: any[]) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscription = (_event: IpcRendererEvent, ...args: any[]) => {
    func(...args);
  };
  ipcRenderer.on(channel, subscription);
  return () => {
    ipcRenderer.removeListener(channel, subscription);
  };
}

/**
 * Provides data related to the current `Project` and exposes methods to modify
 * the current `Project`
 */
export const configService = {
  onTitleChange: (func: (title: string) => void) => {
    return addOnChangeListener(HOST.TITLE, func);
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

  /**
   * Send an updated copy of a device config to the backend.
   */
  updateDevice(config: DeviceConfigStub) {
    ipcRenderer.send(CONFIG.UPDATE_DEVICE, config);
  },

  /**
   * Subscribe to changes made to input config for given `deviceId` and
   * `inputId`
   */
  onInputConfigChange<T extends InputConfigStub = InputConfigStub>(
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

  onInputConfigsChange<T extends InputConfigStub = InputConfigStub>(
    func: (configs: T[]) => void
  ) {
    return addOnChangeListener(CONFIG.INPUT_CONFIG_CHANGE, func);
  },

  requestInputConfigs(deviceId: string, inputIds: string[]) {
    ipcRenderer.send(CONFIG.REQUEST_INPUT_CONFIG_STUB, deviceId, inputIds);
  },

  updateInputs(deviceId: string, configs: InputConfigStub[]) {
    ipcRenderer.send(CONFIG.UPDATE_INPUT, deviceId, configs);
  },

  getConfiguredDevices: () => {
    return ipcRenderer.sendSync(CONFIG.GET_CONFIGURED_DEVICES);
  },

  /**
   * Invokes `func` whenever the list of configured devices changes, e.g.
   * when a new project is loaded for a given device is connected. Also immediately
   * invokes `func` with currently-configured devices
   */
  onConfiguredDevicesChange: (func: (stubs: DeviceConfigStub[]) => void) => {
    return addOnChangeListener(CONFIG.CONFIGURED_DEVICES, func);
  },

  /**
   * Subscribe to changes to a config for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onConfigChange(
    deviceId: string,
    func: (desc: DeviceConfigStub | undefined) => void
  ) {
    const off = addOnChangeListener(`device-config-stub-${deviceId}`, func);
    ipcRenderer.send(CONFIG.REQUEST_DEVICE_CONFIG_STUB, deviceId);
    return off;
  },
};
