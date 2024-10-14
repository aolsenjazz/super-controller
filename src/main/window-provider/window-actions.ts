import { BrowserWindow, BrowserWindowConstructorOptions, Menu } from 'electron';

import { UnknownAction } from '@reduxjs/toolkit';
import { TimestampedMidiEvent } from '@shared/timestamped-midi-event';

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

  public sendLoopbackMessage(
    deviceId: string,
    inputId: string,
    msg: NumberArrayWithStatus | TimestampedMidiEvent
  ) {
    this.sendReduxEvent({
      type: 'recentLoopbackMessages/addMessage',
      payload: {
        deviceId,
        inputId,
        message: { msg, time: Date.now() },
      },
    });
  }

  public sendRemoteMessage(
    deviceId: string,
    inputId: string,
    msg: NumberArrayWithStatus | TimestampedMidiEvent
  ) {
    this.sendReduxEvent({
      type: 'recentRemoteMessages/addMessage',
      payload: {
        deviceId,
        inputId,
        message: { msg, time: Date.now() },
      },
    });
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

  protected sendReduxEvent(action: UnknownAction) {
    this.send('redux', action);
  }

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
