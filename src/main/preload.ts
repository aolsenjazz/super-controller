/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 * Note that currently, none of this is being done in a 'safe' way; none of the
 * security precautions recommended by electron are implemented here because there
 * is currently no usage of remote services, code, etc.
 */

import { DeviceDriver } from '@shared/driver-types/device-driver';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
  PORTS,
} = require('../shared/ipc-channels');

let drivers: Map<string, DeviceDriver>;

const hostService = {
  getHost: () => {
    return ipcRenderer.sendSync('os');
  },
};

const portService = {
  requestPorts: () => {
    ipcRenderer.send(PORTS);
  },
};

const driverService = {
  getDrivers: () => {
    if (!drivers) {
      const response = ipcRenderer.sendSync('drivers');
      drivers = new Map(response);
    }
    return drivers;
  },
  request: (deviceName: string) => {
    ipcRenderer.send('request', deviceName);
  },
};

// TODO: this is very lazy. each of these functions belong in a specific and narrow service class
const IpcRenderer = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, args);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(channel: string, func: (event: IpcRendererEvent, ...args: any[]) => void) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = (event: IpcRendererEvent, args: any[]) =>
      func(event, args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  once(channel: string, func: () => void) {
    ipcRenderer.once(channel, func);
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

contextBridge.exposeInMainWorld('portService', portService);
contextBridge.exposeInMainWorld('hostService', hostService);
contextBridge.exposeInMainWorld('driverService', driverService);
contextBridge.exposeInMainWorld('ipcRenderer', IpcRenderer);

export type PortService = typeof portService;
export type HostService = typeof hostService;
export type DriverService = typeof driverService;
export type IPCRenderer = typeof IpcRenderer;
