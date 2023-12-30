/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 *
 * All of these functions occur in the main process, and so (unfortunately), there
 * is no point in reconstructing proper Objects (PortPair, etc) until the JSX objects
 *
 * TODO: but service should be available here. should be able to refactor + simplify a lot of this
 * if this is the case
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { ConfigStub } from '@shared/hardware-config/device-config';
import { DeviceStub } from '@shared/device-stub';
import { MidiArray } from '@shared/midi-array';
import { InputConfigStub } from '@shared/hardware-config/input-config/base-input-config';

import {
  REQUEST_INPUT_STATE,
  REQUEST_CONFIG_STUB,
  REQUEST_CONNECTED_DEVICES,
  CONNECTED_DEVICES,
  REQUEST_CONFIGURED_DEVICES,
  CONFIGURED_DEVICES,
  REQUEST_DEVICE_STUB,
  REMOVE_TRANSLATOR_OVERRIDE,
  ADD_TRANSLATOR_OVERRIDE,
  GET_TRANSLATOR_OVERRIDE,
  REQUEST_OVERRIDES,
  REQUEST_INPUT_CONFIG,
  INPUT_CONFIG_CHANGE,
  OS,
  TITLE,
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
} from './ipc-channels';

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
    return ipcRenderer.sendSync(OS, process.platform) as Host;
  },

  /**
   * Tells the host that the client would like to request the creation of a new driver
   *
   * @param deviceName The device name
   */
  request: (deviceName?: string) => {
    ipcRenderer.send('request', deviceName);
  },

  /**
   * Sets a callback function to be invoked when the host receives MIDI data from a
   * MIDI port
   *
   * @param func The callbacack function to be invoked
   */
  onMessage: (deviceId: string, func: (msg: MidiTuple) => void) => {
    return addOnChangeListener(`${deviceId}-message`, func);
  },
};

/**
 * Provides data related to the current `Project` and exposes methods to modify
 * the current `Project`
 */
const projectService = {
  onTitleChange: (func: (title: string) => void) => {
    return addOnChangeListener(TITLE, func);
  },

  // TODO: worth documenting this to specify how adapters/supporteds are handled
  addDevice(
    deviceName: string,
    siblingIndex: number,
    driverName?: string,
    childName?: string
  ) {
    ipcRenderer.send(
      ADD_DEVICE,
      deviceName,
      siblingIndex,
      driverName,
      childName
    );
  },

  /**
   * Inform that backend that the given device was removed
   *
   * @param id The id of the device being removed
   */
  removeDevice(id: string) {
    ipcRenderer.send(REMOVE_DEVICE, id);
  },

  /**
   * Send an updated copy of a device config to the backend.
   *
   * @param deviceString Serialized version of the device
   */
  updateDevice(config: ConfigStub) {
    ipcRenderer.send(UPDATE_DEVICE, config);
  },

  removeTranslatorOverride(deviceId: string, action: NumberArrayWithStatus) {
    ipcRenderer.send(REMOVE_TRANSLATOR_OVERRIDE, deviceId, action);
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
      ADD_TRANSLATOR_OVERRIDE,
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
    return ipcRenderer.sendSync(GET_TRANSLATOR_OVERRIDE, deviceId, action);
  },

  requestOverrides(deviceId: string) {
    ipcRenderer.send(REQUEST_OVERRIDES, deviceId);
  },

  onOverridesChange(
    deviceId: string,
    func: (overrides: Map<string, MidiArray>) => void
  ) {
    return addOnChangeListener(`${deviceId}-overrides`, func);
  },

  onInputConfigChange(func: (configs: InputConfigStub[]) => void) {
    return addOnChangeListener(INPUT_CONFIG_CHANGE, func);
  },

  requestInputConfigs(deviceId: string, inputIds: string[]) {
    ipcRenderer.send(REQUEST_INPUT_CONFIG, deviceId, inputIds);
  },

  updateInputs(deviceId: string, configs: InputConfigStub[]) {
    ipcRenderer.send(UPDATE_INPUT, deviceId, configs);
  },

  onConfiguredDevicesChange: (func: (stubs: ConfigStub[]) => void) => {
    return addOnChangeListener(CONFIGURED_DEVICES, func);
  },

  requestConfiguredDevices: () => {
    ipcRenderer.send(REQUEST_CONFIGURED_DEVICES);
  },

  /**
   * Subscribe to changes to a config for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onConfigChange: (
    deviceId: string,
    func: (desc: ConfigStub | undefined) => void
  ) => {
    return addOnChangeListener(`config-stub-${deviceId}`, func);
  },

  requestConfigStub: (id: string) => {
    ipcRenderer.send(REQUEST_CONFIG_STUB, id);
  },
};

// TODO: right now, updates to inputs/device configs are split between project service
// and the device service
const deviceService = {
  onConnectedDevicesChange: (func: (stubs: DeviceStub[]) => void) => {
    return addOnChangeListener(CONNECTED_DEVICES, func);
  },

  requestConnectedDevices: () => {
    ipcRenderer.send(REQUEST_CONNECTED_DEVICES);
  },

  onDeviceChange: (
    deviceId: string,
    func: (desc: DeviceStub | undefined) => void
  ) => {
    return addOnChangeListener(`device-stub-${deviceId}`, func);
  },

  requestDeviceStub: (id: string) => {
    ipcRenderer.send(REQUEST_DEVICE_STUB, id);
  },

  onInputChange: <T>(
    deviceId: string,
    inputId: string,
    func: (state: T) => void
  ) => {
    return addOnChangeListener(`device-${deviceId}-input-${inputId}`, func);
  },

  requestInputState: (deviceId: string, inputId: string) => {
    ipcRenderer.send(REQUEST_INPUT_STATE, deviceId, inputId);
  },
};

contextBridge.exposeInMainWorld('projectService', projectService);
contextBridge.exposeInMainWorld('hostService', hostService);
contextBridge.exposeInMainWorld('deviceService', deviceService);

export type ProjectService = typeof projectService;
export type HostService = typeof hostService;
export type DeviceService = typeof deviceService;
