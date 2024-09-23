import { BrowserWindow } from 'electron';
import os from 'os';

import {
  InputDTO,
  InputState,
} from '@shared/hardware-config/input-config/base-input-config';
import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import type { DeviceConnectionDetails } from '@shared/device-connection-details';

import { HOST, CONFIG } from '../ipc-channels';
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

  public sendConnectedDevices(connectionIds: string[]) {
    this.send(HOST.CONNECTED_DEVICES, connectionIds);
  }

  public sendConfiguredDevices(deviceConfigIds: string[]) {
    this.send(CONFIG.CONFIGURED_DEVICES, deviceConfigIds);
  }

  public sendDeviceStub(id: string, desc: DeviceConnectionDetails | undefined) {
    this.send(`device-stub-${id}`, desc);
  }

  public sendConfigStub(
    id: string,
    desc: Omit<DeviceConfigDTO, 'className'> | undefined
  ) {
    this.send(`device-config-stub-${id}`, desc);
  }

  public sendInputConfigs(configs: InputDTO[]) {
    this.send(CONFIG.INPUT_CONFIG_CHANGE, configs);
  }

  public sendInputState<T extends InputState>(
    deviceId: string,
    inputId: string,
    state: T
  ) {
    this.send(`device-${deviceId}-input-${inputId}-state`, state);
  }

  public sendInputConfig<T extends InputDTO>(
    deviceId: string,
    inputId: string,
    config: T
  ) {
    this.send(`device-${deviceId}-input-${inputId}-config`, config);
  }
}
