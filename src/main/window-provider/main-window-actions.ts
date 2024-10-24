import { BrowserWindow } from 'electron';
import os from 'os';

import { DeviceConnectionDetails } from '@shared/device-connection-details';
import type { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import type { InputDTO } from '@shared/hardware-config/input-config/base-input-config';
import type { PluginDTO } from '@plugins/core/base-plugin';

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

  public setConnectedDevices(devices: DeviceConnectionDetails[]) {
    this.sendReduxEvent({
      type: 'connectedDevices/setAll',
      payload: devices,
    });
  }

  public upsertConfiguredDevice(device: DeviceConfigDTO) {
    this.sendReduxEvent({
      type: 'configuredDevices/upsertOne',
      payload: device,
    });
  }

  public setConfiguredDevices(devices: DeviceConfigDTO[]) {
    this.sendReduxEvent({
      type: 'configuredDevices/setAll',
      payload: devices,
    });
  }

  public upsertInputConfig(config: InputDTO) {
    this.sendReduxEvent({
      type: 'inputConfigs/upsertOne',
      payload: config,
    });
  }

  public upsertInputConfigs(configs: InputDTO[]) {
    this.sendReduxEvent({
      type: 'inputConfigs/upsertMany',
      payload: configs,
    });
  }

  public setInputConfigs(configs: InputDTO[]) {
    this.sendReduxEvent({
      type: 'inputConfigs/setAll',
      payload: configs,
    });
  }

  public upsertPlugin(dto: PluginDTO) {
    this.sendReduxEvent({
      type: 'plugins/upsertOne',
      payload: dto,
    });
  }

  public removePlugins(plugins: string[]) {
    this.sendReduxEvent({
      type: 'plugins/removeMany',
      payload: plugins,
    });
  }

  public setPlugins(plugins: PluginDTO[]) {
    this.sendReduxEvent({
      type: 'plugins/setAll',
      payload: plugins,
    });
  }

  public removeInputs(inputs: string[]) {
    this.sendReduxEvent({
      type: 'inputConfigs/removeMany',
      payload: inputs,
    });
  }
}
