/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 *
 * All of these functions occur in the main process, and so (unfortunately), there
 * is no point in reconstructing proper Objects (PortPair, etc) until the JSX objects
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { PortInfo } from '@shared/port-info';

import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
  PORTS,
  PROJECT,
  MSG,
  OS,
  TITLE,
  REQUEST_DEVICE_LIST,
  DEVICE_LIST,
  DEVICE_DESCRIPTOR,
  REQUEST_DEVICE_DESCRIPTOR,
  REQUEST_INPUT_DESCRIPTOR,
  REQUEST_CONFIG_DESCRIPTOR,
} from './ipc-channels';
import { DeviceDescriptor } from '@shared/hardware-config/descriptors/device-descriptor';
import { ConfigDescriptor } from '@shared/hardware-config/device-config';

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
 * Expose data re. the host (usually the OS + hardware) to the renderer process
 */
const hostService = {
  /**
   * Returns a string representation of the current operating system
   */
  getHost: () => {
    return ipcRenderer.sendSync(OS, process.platform);
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
  onMessage: (
    func: (inputId: string, deviceId: string, msg: MidiTuple) => void
  ) => {
    return addOnChangeListener(MSG, func);
  },

  /**
   * Requests that the host send updated port information
   */
  requestPorts: () => {
    ipcRenderer.send(PORTS);
  },

  /**
   * Registers a callback to be invoked whenever the available MIDI ports change
   *
   * @param func The callback to be invoked
   */
  onPortsChange: (func: (ports: PortInfo[]) => void) => {
    return addOnChangeListener(PORTS, func);
  },
};

/**
 * Provides data related to the current `Project` and exposes methods to modify
 * the current `Project`
 */
const projectService = {
  /**
   * Invokes a callback when the current `Project` is modified
   *
   * @param func The callback
   */
  onProjectChange: (func: (projJSON: string) => void) => {
    return addOnChangeListener(PROJECT, func);
  },

  /**
   * Invokes a callback when the project title is changed
   *
   * @param func The callback
   */
  onTitleChange: (func: (title: string) => void) => {
    return addOnChangeListener(TITLE, func);
  },

  /**
   * Inform the backend to add the device
   *
   * @param configJSON JSON representation of the device config
   */
  addDevice(configString: string) {
    ipcRenderer.send(ADD_DEVICE, configString);
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
  updateDevice(d: string) {
    ipcRenderer.send(UPDATE_DEVICE, d);
  },

  /**
   * Send an updated copy of the configuration for the given input for the given device.
   *
   * @param deviceId The ID of the parent device
   * @param inputString The serialized `InputConfig`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateInput(deviceId: string, i: string) {
    ipcRenderer.send(UPDATE_INPUT, deviceId, i);
  },
};

const deviceService = {
  onDeviceListChange: (func: (ids: string[]) => void) => {
    return addOnChangeListener(DEVICE_LIST, func);
  },

  requestDeviceList: () => {
    ipcRenderer.send(REQUEST_DEVICE_LIST);
  },

  /**
   * Subscribe to changes to a device for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onDeviceChange: (
    deviceId: string,
    func: (desc: DeviceDescriptor) => void
  ) => {
    return addOnChangeListener(`device-descriptor-${deviceId}`, func);
  },

  requestDeviceDescriptor: (id: string) => {
    ipcRenderer.send(REQUEST_DEVICE_DESCRIPTOR, id);
  },

  /**
   * Subscribe to changes to a config for the given id. A new channel named
   * `device-descriptor-{deviceId}` will be created to which the renderer can listen.
   */
  onConfigChange: (
    deviceId: string,
    func: (desc: ConfigDescriptor | undefined) => void
  ) => {
    return addOnChangeListener(`config-descriptor-${deviceId}`, func);
  },

  requestConfigDescriptor: (id: string) => {
    ipcRenderer.send(REQUEST_CONFIG_DESCRIPTOR, id);
  },

  onInputChange: <T>(
    deviceId: string,
    inputId: string,
    func: (desc: T) => void
  ) => {
    return addOnChangeListener(`device-${deviceId}-input-${inputId}`, func);
  },

  requestInputDescriptor: (deviceId: string, inputId: string) => {
    ipcRenderer.send(REQUEST_INPUT_DESCRIPTOR, deviceId, inputId);
  },
};

contextBridge.exposeInMainWorld('projectService', projectService);
contextBridge.exposeInMainWorld('hostService', hostService);
contextBridge.exposeInMainWorld('deviceService', deviceService);

export type ProjectService = typeof projectService;
export type HostService = typeof hostService;
export type DeviceService = typeof deviceService;
