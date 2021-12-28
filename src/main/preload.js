/**
 * Exposes icpRenderer communication to the renderer process via `ContextBridge`.
 * Note that currently, none of this is being done in a 'safe' way; none of the
 * security precautions recommended by electron are implemented here because there
 * is currently no usage of remote services, code, etc.
 */

const { contextBridge, ipcRenderer } = require('electron');

const {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
  UPDATE_INPUT,
} = require('../ipc-channels.js');

contextBridge.exposeInMainWorld('ipcRenderer', {
  send(channel, ...args) {
    ipcRenderer.send(channel, args);
  },

  on(channel, func) {
    const subscription = (event, ...args) => func(event, ...args);
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  once(channel, func) {
    ipcRenderer.once(channel, func);
  },

  /**
   * Inform the backend to add the device
   *
   * @param configJSON JSON representation of the device config
   */
  addDevice(configJSON) {
    ipcRenderer.send(ADD_DEVICE, configJSON);
  },

  /**
   * Inform that backend that the given device was removed
   *
   * @param id The id of the device being removed
   */
  removeDevice(id) {
    ipcRenderer.send(REMOVE_DEVICE, id);
  },

  /**
   * Send an updated copy of a device config to the backend.
   *
   * @param deviceString Serialized version of the device
   */
  updateDevice(deviceString) {
    ipcRenderer.send(UPDATE_DEVICE, deviceString);
  },

  /**
   * Send an updated copy of the configuration for the given input for the given device.
   *
   * @param deviceId The ID of the parent device
   * @param inputString The serialized `InputConfig`
   */
  updateInput(deviceId, inputString) {
    ipcRenderer.send(UPDATE_INPUT, deviceId, inputString);
  },
});
