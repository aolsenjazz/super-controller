/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 *
 * All of these functions occur in the main process, and so (unfortunately), there
 * is no point in reconstructing proper Objects (PortPair, etc) until the JSX objects
 */

import { DeviceDriver } from '@shared/driver-types/device-driver';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { DrivenPortInfo } from '@shared/driven-port-info';

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
} from './ipc-channels';

let drivers: Map<string, DeviceDriver>;

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
    return ipcRenderer.sendSync(OS);
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
  onPortsChange: (func: (ports: DrivenPortInfo[]) => void) => {
    return addOnChangeListener(PORTS, func);
  },
};

/**
 * Exposes data re. which drivers are available to the renderer process
 */
const driverService = {
  /**
   *  Returns a map containing the available drivers and their associated labels
   */
  getDrivers: () => {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }
    return drivers;
  },

  getFivePinDrivers: () => {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }

    const fivePinDrivers = new Map<string, DeviceDriver>();
    drivers.forEach((v, k) => {
      if (v.type === '5pin') {
        fivePinDrivers.set(k, v);
      }
    });

    return fivePinDrivers;
  },

  getDriver: (name: string | undefined) => {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }

    if (name === undefined) return undefined;

    return drivers.get(name);
  },

  getDriverById: (id: string | undefined) => {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }

    if (id === undefined) return undefined;

    const name = id.substr(0, id.lastIndexOf(' '));

    return drivers.get(name);
  },

  isSupported(name: string) {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }

    return drivers.get(name) !== undefined;
  },

  isSupportedById(id: string) {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }

    const name = id.substr(0, id.lastIndexOf(' '));
    return drivers.get(name) !== undefined;
  },

  /**
   * Tells the host that the client would like to request the creation of a new driver
   *
   * @param deviceName The device name
   */
  request: (deviceName?: string) => {
    ipcRenderer.send('request', deviceName);
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
  addDevice(configJSON: string) {
    ipcRenderer.send(ADD_DEVICE, configJSON);
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
  updateDevice(deviceString: string) {
    ipcRenderer.send(UPDATE_DEVICE, deviceString);
  },

  /**
   * Send an updated copy of the configuration for the given input for the given device.
   *
   * @param deviceId The ID of the parent device
   * @param inputString The serialized `InputConfig`
   */
  updateInput(deviceId: string, inputString: string) {
    ipcRenderer.send(UPDATE_INPUT, deviceId, inputString);
  },
};

contextBridge.exposeInMainWorld('projectService', projectService);
contextBridge.exposeInMainWorld('hostService', hostService);
contextBridge.exposeInMainWorld('driverService', driverService);

export type ProjectService = typeof projectService;
export type HostService = typeof hostService;
export type DriverService = typeof driverService;
