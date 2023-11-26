import { BrowserWindow } from 'electron';
import os from 'os';

import { BaseInputStub } from '@shared/hardware-config/input-config/base-input-config';
import { ConfigStub } from '@shared/hardware-config/device-config';
import { DeviceStub } from '@shared/device-stub';

import { CONFIGURED_DEVICES, CONNECTED_DEVICES } from '../ipc-channels';
import { getAssetPath, getPreloadPath, resolveHtmlPath } from '../util-main';
import { StatefulWindowActions } from './stateful-window-actions';

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

  public sendConnectedDevices(stubs: DeviceStub[]) {
    this.send(CONNECTED_DEVICES, stubs);
  }

  public sendConfiguredDevices(stubs: ConfigStub[]) {
    this.send(CONFIGURED_DEVICES, stubs);
  }

  public sendDeviceStub(id: string, desc: DeviceStub | undefined) {
    this.send(`device-stub-${id}`, desc);
  }

  public sendConfigStub(id: string, desc: ConfigStub | undefined) {
    this.send(`config-stub-${id}`, desc);
  }

  public sendInputStub<T extends BaseInputStub>(
    deviceId: string,
    inputId: string,
    desc: T | undefined
  ) {
    this.send(`device-${deviceId}-input-${inputId}`, desc);
  }
}
