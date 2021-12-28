export interface IpcRendererAPI {
  send: (channel: string, ...args: any[]) => void;
  on: (channel: string, func: (...args: any[]) => void) => () => void;
  once: (channel: string, func: (...args: any[]) => void) => void;

  /**
   * Inform the backend to add the device
   *
   * @param configJSON JSON representation of the device config
   */
  addDevice: (configJSON: string) => void;

  /**
   * Inform that backend that the given device was removed
   *
   * @param id The id of the device being removed
   */
  removeDevice: (id: string) => void;

  /**
   * Send an updated copy of a device config to the backend.
   *
   * @param deviceString Serialized version of the device
   */
  updateDevice: (deviceString: string) => void;

  /**
   * Send an updated copy of the configuration for the given input for the given device.
   *
   * @param deviceId The ID of the parent device
   * @param inputString The serialized `InputConfig`
   */
  updateInput: (deviceId: string, inputString: string) => void;
}

declare global {
  interface Window {
    ipcRenderer: IpcRendererAPI;
  }
}
