import { ipcRenderer as electronIpc } from 'electron';

const ADD_DEVICE = 'add-device';
const REMOVE_DEVICE = 'remove-device';
const UPDATE_DEVICE = 'update-device';
const UPDATE_INPUT = 'update-input';

/* Convenience class for communicting with the backend */
class IpcRenderer {
  /**
   * Inform the backend to add the device
   *
   * @param configJSON JSON representation of the device config
   */
  addDevice(configJSON: string) {
    electronIpc.send(ADD_DEVICE, configJSON);
  }

  /**
   * Inform that backend that the given device was removed
   *
   * @param id The id of the device being removed
   */
  removeDevice(id: string) {
    electronIpc.send(REMOVE_DEVICE, id);
  }

  /**
   * Send an updated copy of a device config to the backend.
   *
   * @param deviceString Serialized version of the device
   */
  updateDevice(deviceString: string) {
    electronIpc.send(UPDATE_DEVICE, deviceString);
  }

  /**
   * Send an updated copy of the configuration for the given input for the given device.
   *
   * @param deviceId The ID of the parent device
   * @param inputString The serialized `InputConfig`
   */
  updateInput(deviceId: string, inputString: string) {
    electronIpc.send(UPDATE_INPUT, deviceId, inputString);
  }
}

export const ipcRenderer = new IpcRenderer();
