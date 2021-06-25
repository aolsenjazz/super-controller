import { ipcRenderer as electronIpc } from 'electron';

import { Project } from './project';

/* Convenience class for communicting with the backend */
class IpcRenderer {
  sendProject(
    project: Project,
    preserveState: boolean,
    deviceId?: string,
    inputIds?: string[]
  ) {
    electronIpc.send(
      'project',
      project.toJSON(preserveState),
      deviceId,
      inputIds
    );
  }

  /**
   * Inform the backend that the given device has been removed
   *
   * TODO: kind of silly to require all three of these arguments.
   *
   * @param { string } id The id of the device
   * @param { string } name The name of the device
   * @param { number } occurrenceNumber nth-occurrence of this device
   */
  addDevice(id: string, name: string, occurrenceNumber: number) {
    electronIpc.send('add-device', id, name, occurrenceNumber);
  }

  /**
   * Inform that backend that the given device was removed
   *
   * @param { string } id The id of the device being removed
   */
  removeDevice(id: string) {
    electronIpc.send('remove-device', id);
  }
}

export const ipcRenderer = new IpcRenderer();
