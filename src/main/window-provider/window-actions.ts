import { BrowserWindow, BrowserWindowConstructorOptions, Menu } from 'electron';

import { byteToStatusString } from '@shared/midi-util';
import type { PluginDTO } from '@shared/plugin-core/base-plugin';

import { HOST } from '../ipc-channels';
import { UnknownAction } from '@reduxjs/toolkit';

/**
 * Assumes that this window is stateless, e.g. no state is saved when the
 * window is closed, then loaded when a window is reopened. Therefore, once
 * a window has been closed, this WindowActions should be destroyed an a new
 * one created for single-use windows
 */
export abstract class WindowActions {
  protected id: number | undefined;

  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public create(options: BrowserWindowConstructorOptions | undefined) {
    const w = new BrowserWindow(options);
    this.id = w.id;

    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.initInspectListener(w);
    }

    w.on('ready-to-show', () => w.show());
    w.loadURL(this.url);
  }

  public onLoopbackMessage(
    deviceId: string,
    inputId: string,
    msg: NumberArrayWithStatus
  ) {
    this.send(`${deviceId}-${inputId}-loopback`, msg);
  }

  /**
   * Sends an update to the frontend containing the last-emitted MIDI message from the
   * device with given `deviceId`. This function is 'narrow' because it is expected that
   * very few listeners will be set up for this function's ipc channel.
   */
  public sendNarrowInputEvent(deviceId: string, msg: NumberArrayWithStatus) {
    const statusString = byteToStatusString(msg[0], false);

    this.send(`${deviceId}.${statusString}.${msg[0] & 0x0f}.${msg[1]}`, msg);
  }

  /**
   * Sends an update to the frontend containing the last-emitted MIDI message from the
   * device with the given `deviceId`. This function is different from `sendNarrowInputEvent`
   * in that it is transmitted on a much broader-usage channel, and therefore should
   * be used judiciously.
   */
  public sendInputEvent(deviceId: string, msg: NumberArrayWithStatus) {
    this.send(HOST.MIDI_EVENT, deviceId, msg);
  }

  public sendPluginUpdate(id: string, dto: PluginDTO) {
    this.send(`plugin-${id}`, dto);
  }

  public sendReduxEvent(action: UnknownAction) {
    this.send('redux', action);
  }

  /**
   * Send objects to the frontend
   *
   * @param channel The IPC channel on which to send
   * @param args The objects to send
   */
  /* eslint-disable-next-line */
  protected send = (channel: string, ...args: any[]) => {
    if (this.id === undefined) {
      return;
    }

    const window = BrowserWindow.fromId(this.id);

    if (window !== null) {
      window.webContents.send(channel, ...args);
    }
  };

  /**
   * Creates a menu when HTML elements are right-clicked, consisting of one element:
   * Inspect element
   */
  private initInspectListener(w: BrowserWindow) {
    w.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            w.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: w });
    });
  }
}
