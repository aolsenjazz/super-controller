import { PortInfo } from '@shared/port-info';
import { BrowserWindow } from 'electron';
import { PORTS } from './ipc-channels';

export class WindowActions {
  private windowId: number;

  constructor(windowId: number) {
    this.windowId = windowId;
  }

  /**
   * Send a list of `PortInfo` to the frontend
   *
   * @param portInfos List `PortInfo`s
   */
  public sendPortInfos(portInfos: PortInfo[]) {
    this.send(PORTS, portInfos);
  }

  /**
   * Send objects to the frontend
   *
   * @param channel The IPC channel on which to send
   * @param args The objects to send
   */
  /* eslint-disable-next-line */
  private send = (channel: string, ...args: any[]) => {
    const window = BrowserWindow.fromId(this.windowId);

    if (window !== null) {
      window.webContents.send(channel, ...args);
    }
  };
}
