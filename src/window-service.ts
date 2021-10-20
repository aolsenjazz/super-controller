import { getMainWindow } from 'electron-main-window';
import { MidiValue } from 'midi-message-parser';

import { DeviceDriver } from './driver-types';
import { Project } from './project';
import { PortInfo } from './ports/port-info';

const PROJECT_CHANNEL = 'project';
const PORTS_CHANNEL = 'ports';
const TITLE_CHANNEL = 'title';

/**
 * Convenience class for referring to the main window.
 */
class WindowService {
  /* Has the document been edited (should there be a dot in the close button)? */
  edited = false;

  /**
   * Send a `Project` instance to the frontend
   *
   * @param project The project
   */
  sendProject(project: Project) {
    this.#send(PROJECT_CHANNEL, project.toJSON(true));
  }

  /**
   * Send the new name of the project to the frontend.
   */
  sendTitle(title: string) {
    this.#send(TITLE_CHANNEL, title);
  }

  /**
   * Send a list of `PortInfo` to the frontend
   *
   * @param portInfos List `PortInfo`s
   */
  sendPortInfos(portInfos: PortInfo[]) {
    this.#send(PORTS_CHANNEL, portInfos);
  }

  /**
   * Sets the `window.documentEdited` to `edited`
   *
   * @param edited Is the document edited?
   */
  setEdited(edited: boolean) {
    const windowOrNull = getMainWindow();
    this.edited = edited;

    if (windowOrNull !== null) {
      windowOrNull.documentEdited = edited;
    }
  }

  /**
   * Send the current state of an `InputConfig` to the frontend
   *
   * @param inputId The id of the input
   * @param The last message propagated to device
   * @param The last message propagated to clients
   */
  sendInputState(
    inputId: string,
    toDevice: MidiValue[] | null,
    toPropagate: MidiValue[] | null
  ) {
    this.#send(inputId, toDevice, toPropagate);
  }

  /**
   * TODO: What is this doing? Why does it need to exist when we have input state
   */
  onDeviceMessage(deviceId: string, msg: MidiValue[]) {
    this.#send(deviceId, msg);
  }

  /**
   * Sends the list of drivers to the frontend.
   *
   * TODO: this is gross. surely there's a clean way to load from frontend
   *
   * @param { Map<string, DeviceDriver> } drivers Driver map
   */
  sendDrivers(drivers: Map<string, DeviceDriver>) {
    const list = Array.from(drivers.entries());
    this.#send('drivers', list);
  }

  /**
   * Send objects to the frontend
   *
   * @param { string } channel The IPC channel on which to send
   * @param { any[] } args The objects to send
   */
  /* eslint-disable-next-line */
  #send = (channel: string, ...args: any[]) => {
    const windowOrNull = getMainWindow();

    if (windowOrNull !== null) {
      windowOrNull.webContents.send(channel, ...args);
    }
  };
}

export const windowService = new WindowService();
