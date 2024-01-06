/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 *
 * This file exists in an isolated context with limited access to APIs, so no real work
 * can be done here. More at: https://www.electronjs.org/docs/latest/tutorial/tutorial-preload
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { DeviceConfigStub } from '@shared/hardware-config/device-config';
import { DeviceStub } from '@shared/device-stub';
import { MidiArray } from '@shared/midi-array';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';

import { CONFIG, TRANSLATOR, HOST } from './ipc-channels';

// the frontend uses a lot of listeners. because of this, this number gets
// pretty high. If it complains, make sure that we're not leaking memory,
// then increase this number.
ipcRenderer.setMaxListeners(100);

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
const hostService = {
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
      `device-${deviceId}-input-${inputId}`,
      func
    );
    ipcRenderer.send(HOST.REQUEST_INPUT_STATE, deviceId, inputId);
    return off;
  },
};

/**
 * Contains IPC functions related to translators
 */
const translatorService = {
  removeTranslatorOverride(deviceId: string, action: NumberArrayWithStatus) {
    ipcRenderer.send(TRANSLATOR.REMOVE_TRANSLATOR_OVERRIDE, deviceId, action);
  },

  addTranslatorOverride(
    deviceId: string,
    action: NumberArrayWithStatus,
    statusString: StatusString,
    channel: Channel,
    number: MidiNumber,
    value: MidiNumber
  ) {
    ipcRenderer.send(
      TRANSLATOR.ADD_TRANSLATOR_OVERRIDE,
      deviceId,
      action,
      statusString,
      channel,
      number,
      value
    );
  },

  getTranslatorOverride(
    deviceId: string,
    action: NumberArrayWithStatus
  ): NumberArrayWithStatus | undefined {
    return ipcRenderer.sendSync(
      TRANSLATOR.GET_TRANSLATOR_OVERRIDE,
      deviceId,
      action
    );
  },

  onOverridesChange(
    deviceId: string,
    func: (overrides: Map<string, MidiArray>) => void
  ) {
    const off = addOnChangeListener(`${deviceId}-overrides`, func);
    ipcRenderer.send(TRANSLATOR.REQUEST_OVERRIDES, deviceId);
    return off;
  },
};

/**
 * Provides data related to the current `Project` and exposes methods to modify
 * the current `Project`
 */
const configService = {
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

  onInputConfigChange(func: (configs: InputConfigStub[]) => void) {
    return addOnChangeListener(CONFIG.INPUT_CONFIG_CHANGE, func);
  },

  requestInputConfigs(deviceId: string, inputIds: string[]) {
    ipcRenderer.send(CONFIG.REQUEST_INPUT_CONFIG_STUB, deviceId, inputIds);
  },

  updateInputs(deviceId: string, configs: InputConfigStub[]) {
    ipcRenderer.send(CONFIG.UPDATE_INPUT, deviceId, configs);
  },

  /**
   * Invokes `func` whenever the list of configured devices changes, e.g.
   * when a new project is loaded for a given device is connected. Also immediately
   * invokes `func` with currently-configured devices
   */
  onConfiguredDevicesChange: (func: (stubs: DeviceConfigStub[]) => void) => {
    const off = addOnChangeListener(CONFIG.CONFIGURED_DEVICES, func);
    ipcRenderer.send(CONFIG.REQUEST_CONFIGURED_DEVICES);
    return off;
  },

  /**
   * Subscribe to changes to a config for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onConfigChange(
    deviceId: string,
    func: (desc: DeviceConfigStub | undefined) => void
  ) {
    const off = addOnChangeListener(`config-stub-${deviceId}`, func);
    ipcRenderer.send(CONFIG.REQUEST_DEVICE_CONFIG_STUB, deviceId);
    return off;
  },
};

contextBridge.exposeInMainWorld('ConfigService', configService);
contextBridge.exposeInMainWorld('HostService', hostService);
contextBridge.exposeInMainWorld('TranslatorService', translatorService);

export type ConfigService = typeof configService;
export type HostService = typeof hostService;
export type TranslatorService = typeof translatorService;
