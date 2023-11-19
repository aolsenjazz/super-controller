import { BrowserWindow } from 'electron';
import os from 'os';

import { DeviceDescriptor } from '@shared/hardware-config/descriptors/device-descriptor';
import { BaseInputDescriptor } from '@shared/hardware-config/input-config/base-input-config';

import { DEVICE_LIST } from '../ipc-channels';
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

  public sendDeviceList(deviceIds: string[]) {
    this.send(DEVICE_LIST, deviceIds);
  }

  public sendDeviceDescriptor(desc: DeviceDescriptor) {
    this.send(`device-descriptor-${desc.id}`, desc);
  }

  public sendInputDescriptor<T extends BaseInputDescriptor>(
    deviceId: string,
    inputId: string,
    desc: T
  ) {
    this.send(`device-${deviceId}-input-${inputId}`, desc);
  }
}
