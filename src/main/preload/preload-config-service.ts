import { DeviceIcicle } from '@shared/hardware-config/device-config';
import { InputIcicle } from '@shared/hardware-config/input-config/base-input-config';
import { ipcRenderer } from 'electron';

import { CONFIG, HOST } from '../ipc-channels';
import { addOnChangeListener } from './common';

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
  updateDevice(config: DeviceIcicle) {
    ipcRenderer.send(CONFIG.UPDATE_DEVICE, config);
  },

  /**
   * Subscribe to changes made to input config for given `deviceId` and
   * `inputId`
   */
  onInputConfigChange<T extends InputIcicle = InputIcicle>(
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

  getInputConfigs<T extends InputIcicle = InputIcicle>(
    deviceId: string,
    inputIds: string[]
  ): T[] {
    return ipcRenderer.sendSync('get-input-configs', deviceId, inputIds);
  },

  requestInputConfigs(deviceId: string, inputIds: string[]) {
    ipcRenderer.send(CONFIG.REQUEST_INPUT_CONFIG_STUB, deviceId, inputIds);
  },

  updateInputs(deviceId: string, configs: InputIcicle[]) {
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
  onConfiguredDevicesChange: (func: (stubs: DeviceIcicle[]) => void) => {
    return addOnChangeListener(CONFIG.CONFIGURED_DEVICES, func);
  },

  /**
   * Subscribe to changes to a config for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onDeviceConfigChange(
    deviceId: string,
    func: (desc: DeviceIcicle | undefined) => void
  ) {
    return addOnChangeListener(`device-config-stub-${deviceId}`, func);
  },

  getDeviceConfig(deviceId: string) {
    return ipcRenderer.sendSync(CONFIG.GET_DEVICE_CONFIG, deviceId);
  },
};

export type ConfigService = typeof configService;
