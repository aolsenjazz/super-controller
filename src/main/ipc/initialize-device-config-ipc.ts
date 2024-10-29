import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import type { BasePluginManifest } from '@plugins/core/base-plugin-manifest';
import { ConfigManager } from '@main/config-manager';

import { DEVICE_CONFIG } from './ipc-channels';
import { WindowProvider } from '../window-provider';
import { DeviceRegistry } from '../registry/device-registry';
import { createDevicePluginMenu } from '../menu/device-plugin-menu';

const { MainWindow } = WindowProvider;

ipcMain.on(
  DEVICE_CONFIG.ADD_DEVICE,
  (
    _e: IpcMainEvent,
    deviceName: string,
    siblingIdx: number,
    driverName?: string,
  ) => {
    ConfigManager.addDeviceConfig(deviceName, siblingIdx, driverName);
  },
);

ipcMain.on(
  DEVICE_CONFIG.REMOVE_DEVICE,
  (_e: IpcMainEvent, deviceId: string) => {
    ConfigManager.removeDevice(deviceId);
  },
);

ipcMain.on(
  DEVICE_CONFIG.UPDATE_DEVICE,
  (_e: IpcMainEvent, updates: DeviceConfigDTO) => {
    const config = DeviceRegistry.get(updates.id);

    if (config) {
      config.applyStub(updates);
      MainWindow.upsertConfiguredDevice(config.toDTO());
    }

    MainWindow.edited = true;
  },
);

ipcMain.on(
  DEVICE_CONFIG.DEVICE_PLUGIN_MENU,
  async (e: IpcMainEvent, x: number, y: number, deviceId: string) => {
    // menu item onClick listener
    const onClick = async (m: BasePluginManifest) => {
      ConfigManager.addDevicePlugin(deviceId, m);
    };

    // show the menu
    const template = await createDevicePluginMenu(onClick);
    const menu = Menu.buildFromTemplate(template);
    const win = BrowserWindow.fromWebContents(e.sender) || undefined;
    menu.popup({ window: win, x, y });
  },
);

ipcMain.on(
  DEVICE_CONFIG.REMOVE_PLUGIN,
  (_e: IpcMainEvent, pluginId: string, deviceConfigId: string) => {
    ConfigManager.removeDevicePlugin(deviceConfigId, pluginId);
  },
);

ipcMain.on(
  DEVICE_CONFIG.SET_CHILD,
  (_e: IpcMainEvent, deviceConfigId: string, childDriverName: string) => {
    ConfigManager.setAdapterChild(deviceConfigId, childDriverName);
  },
);

ipcMain.on(DEVICE_CONFIG.GET_CONFIGURED_DEVICES, (e: IpcMainEvent) => {
  const configs = DeviceRegistry.getAll().map((d) => d.toDTO());
  e.returnValue = configs;
});
