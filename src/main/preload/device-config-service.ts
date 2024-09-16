import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import { ipcRenderer } from 'electron';

import { CONFIG, DEVICE_CONFIG } from '../ipc-channels';
import { addOnChangeListener } from './common';

/**
 * Provides data related to the current `Project` and exposes methods to modify
 * the current `Project`
 */
export const deviceConfigService = {
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

  getInputConfigs<T extends InputDTO = InputDTO>(
    deviceId: string,
    inputIds: string[]
  ): T[] {
    return ipcRenderer.sendSync('get-input-configs', deviceId, inputIds);
  },

  requestInputConfigs(deviceId: string, inputIds: string[]) {
    ipcRenderer.send(CONFIG.REQUEST_INPUT_CONFIG_STUB, deviceId, inputIds);
  },

  updateInputs(deviceId: string, configs: InputDTO[]) {
    ipcRenderer.send(CONFIG.UPDATE_INPUT, deviceId, configs);
  },

  removePlugin: (pluginId: string, deviceConfigId: string) => {
    ipcRenderer.send(DEVICE_CONFIG.REMOVE_PLUGIN, pluginId, deviceConfigId);
  },

  getConfiguredDevices: () => {
    return ipcRenderer.sendSync(
      CONFIG.GET_CONFIGURED_DEVICES
    ) as DeviceConfigDTO[];
  },

  /**
   * Invokes `func` whenever the list of configured devices changes, e.g.
   * when a new project is loaded for a given device is connected.
   */
  onConfiguredDevicesChange: (func: (stubs: DeviceConfigDTO[]) => void) => {
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
    return ipcRenderer.sendSync(CONFIG.GET_DEVICE_CONFIG, deviceId);
  },
};

export type DeviceConfigService = typeof deviceConfigService;
