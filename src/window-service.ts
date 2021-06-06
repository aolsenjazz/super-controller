import { getMainWindow } from 'electron-main-window';
import { MidiValue } from 'midi-message-parser';

import { DeviceDriver } from './driver-types';
import { Project } from './project';
import { PortInfo } from './ports/port-info';

const PROJECT_CHANNEL = 'project';
const PORTS_CHANNEL = 'ports';

class WindowService {
  edited = false;

  sendProject(project: Project) {
    this.#send(PROJECT_CHANNEL, project.toJSON(true));
  }

  sendPortInfos(portInfos: PortInfo[]) {
    this.#send(PORTS_CHANNEL, portInfos);
  }

  setEdited(edited: boolean) {
    const windowOrNull = getMainWindow();
    this.edited = edited;

    if (windowOrNull !== null) {
      windowOrNull.documentEdited = edited;
    }
  }

  sendInputState(
    inputId: string,
    toDevice: MidiValue[] | null,
    toPropagate: MidiValue[] | null
  ) {
    this.#send(inputId, toDevice, toPropagate);
  }

  sendDrivers(drivers: Map<string, DeviceDriver>) {
    const list = Array.from(drivers.entries());
    this.#send('drivers', list);
  }

  /* eslint-disable-next-line */
  #send = (channel: string, ...args: any[]) => {
    const windowOrNull = getMainWindow();

    if (windowOrNull !== null) {
      windowOrNull.webContents.send(channel, ...args);
    }
  };
}

export const windowService = new WindowService();
