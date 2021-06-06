import { ipcRenderer as electronIpc } from 'electron';

import { Project } from './project';

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

  addDevice(id: string, name: string, occurrenceNumber: number) {
    electronIpc.send('add-device', id, name, occurrenceNumber);
  }

  removeDevice(id: string) {
    electronIpc.send('remove-device', id);
  }
}

export const ipcRenderer = new IpcRenderer();
