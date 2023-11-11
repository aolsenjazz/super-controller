import { BrowserWindow } from 'electron';

import { Project } from '@shared/project';
import { PortInfo } from '@shared/port-info';
import { stringify } from '@shared/util';

import { MSG, TITLE, PROJECT, PORTS } from './ipc-channels';

/**
 * Convenience class for accessing the main window. Used for:
 *
 * 1. Sending information to the client
 * 2. Setting the document-edited state
 */
class WindowServiceSingleton {
  /* Has the document been edited (should there be a dot in the close button)? */
  edited = false;

  private static instance: WindowServiceSingleton;

  private constructor() {}

  public static getInstance(): WindowServiceSingleton {
    if (!WindowServiceSingleton.instance) {
      WindowServiceSingleton.instance = new WindowServiceSingleton();
    }
    return WindowServiceSingleton.instance;
  }

  /**
   * Send a serialized `Project` to the frontend
   *
   * @param project The project
   */
  sendProject(project: Project) {
    this.#send(PROJECT, stringify(project));
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
    const windows = BrowserWindow.getAllWindows();
    const window = windows.length ? windows[0] : null;
    this.edited = edited;

    if (window !== null) {
      window.documentEdited = edited;
    }
  }

  sendInputMsg(inputId: string, deviceId: string, msg: number[]) {
    this.#send(MSG, inputId, deviceId, msg);
  }

  /**
   * Send objects to the frontend
   *
   * @param channel The IPC channel on which to send
   * @param args The objects to send
   */
  /* eslint-disable-next-line */
  #send = (channel: string, ...args: any[]) => {
    const windows = BrowserWindow.getAllWindows();
    const window = windows.length ? windows[0] : null;

    if (window !== null) {
      window.webContents.send(channel, ...args);
    }
  };
}

export const WindowService = WindowServiceSingleton.getInstance();
