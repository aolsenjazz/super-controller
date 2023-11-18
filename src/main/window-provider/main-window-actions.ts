import { BrowserWindow } from 'electron';
import os from 'os';

import { PortInfo } from '@shared/port-info';

import { PORTS, PROJECT } from '../ipc-channels';
import { getAssetPath, getPreloadPath, resolveHtmlPath } from '../util-main';
import { StatefulWindowActions } from './stateful-window-actions';
import { stringify } from '@shared/util';

/**
 * Provides a number of frequently-used functions targetting the main window.
 * Saves state in between closing and recreating the window.
 */
export class MainWindowActions extends StatefulWindowActions {
  constructor() {
    super(resolveHtmlPath('index.html'), 'Untitled project');
  }

  public create() {
    // don't create more than 1 main window
    if (BrowserWindow.fromId(this.id || -1) !== null) {
      return;
    }

    super.create({
      show: false,
      width: 1024,
      height: 600,
      transparent: true,
      frame: false,
      minHeight: 312,
      minWidth: 850,
      titleBarStyle: os.platform() === 'darwin' ? 'hiddenInset' : 'default',
      icon: getAssetPath('icon.png'),
      webPreferences: { preload: getPreloadPath() },
    });
  }

  /**
   * Send a list of `PortInfo` to the frontend
   *
   * @param portInfos List `PortInfo`s
   */
  public sendPortInfos(portInfos: PortInfo[]) {
    this.send(PORTS, portInfos);
  }

  sendProject(p: Project) {
    this.send(PROJECT, stringify(p));
  }
}
