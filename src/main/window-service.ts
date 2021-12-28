import { getMainWindow } from 'electron-main-window';
import { MidiValue } from 'midi-message-parser';

import { DeviceDriver } from '../driver-types';
import { Project } from '../project';
import { PortInfo } from '../ports/port-info';

import { MSG, TITLE, PROJECT, PORTS } from '../ipc-channels';

/**
 * Convenience class for accessing the main window. Used for:
 *
 * 1. Sending information to the client
 * 2. Setting the document-edited state
 */
class WindowService {
  /* Has the document been edited (should there be a dot in the close button)? */
  edited = false;

  /**
   * Send a serialized `Project` to the frontend
   *
   * @param project The project
   */
  sendProject(project: Project) {
    this.#send(PROJECT, project.toJSON(true));
  }

  /**
   * Send the new name of the current document to the frontend.
   */
  sendTitle(title: string) {
    this.#send(TITLE, title);
  }

  /**
   * Send a list of `PortInfo` to the frontend
   *
   * @param portInfos List `PortInfo`s
   */
  sendPortInfos(portInfos: PortInfo[]) {
    this.#send(PORTS, portInfos);
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

  sendInputMsg(inputId: string, deviceId: string, msg: MidiValue[]) {
    this.#send(MSG, inputId, deviceId, msg);
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
