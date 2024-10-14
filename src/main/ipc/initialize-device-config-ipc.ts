import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { getQualifiedInputId } from '@shared/util';
import { Anonymous, DRIVERS, getDriver } from '@shared/drivers';
import { PluginManifest } from '@shared/plugin-core/plugin-manifest';
import { importDeviceSubcomponent } from '@plugins/plugin-loader';
import { BasePlugin } from '@shared/plugin-core/base-plugin';
import { configFromDriver } from '@shared/hardware-config';
import { SupportedDeviceConfig } from '@shared/hardware-config/supported-device-config';
import { AdapterDeviceConfig } from '@shared/hardware-config/adapter-device-config';

import { DEVICE_CONFIG } from './ipc-channels';
import { WindowProvider } from '../window-provider';
import { PluginRegistry } from '../plugin-registry';
import { DeviceRegistry } from '../device-registry';
import { HardwarePortService } from '../port-service';
import { VirtualPortService } from '../port-service/virtual/virtual-port-service';
import { InputRegistry } from '../input-registry';
import { createDevicePluginMenu } from '../menu/device-plugin-menu';

const { MainWindow } = WindowProvider;

ipcMain.on(
  DEVICE_CONFIG.ADD_DEVICE,
  (
    _e: IpcMainEvent,
    deviceName: string,
    siblingIdx: number,
    driverName?: string
  ) => {
    const driver = getDriver(driverName || deviceName) || Anonymous;
    const conf = configFromDriver(deviceName, siblingIdx, driver);

    HardwarePortService.onConfigChange({ action: 'add', changed: [conf] });
    VirtualPortService.onConfigChange({ action: 'add', changed: [conf] });

    const allDevices = DeviceRegistry.getAll().map((c) => c.toDTO());
    MainWindow.setConfiguredDevices(allDevices);

    if (conf instanceof SupportedDeviceConfig) {
      const inputDTOs = conf.inputs
        .map((id) => getQualifiedInputId(conf.id, id))
        .map((qid) => InputRegistry.get(qid)!)
        .map((i) => i.toDTO());

      MainWindow.upsertInputConfigs(inputDTOs);
    }

    MainWindow.edited = true;
  }
);

ipcMain.on(
  DEVICE_CONFIG.REMOVE_DEVICE,
  (_e: IpcMainEvent, deviceId: string) => {
    const conf = DeviceRegistry.get(deviceId)!;

    DeviceRegistry.deregister(deviceId);

    HardwarePortService.onConfigChange({ action: 'remove', changed: [conf] });
    VirtualPortService.onConfigChange({ action: 'remove', changed: [conf] });

    MainWindow.edited = true;
    const devices = DeviceRegistry.getAll().map((c) => c.toDTO());
    MainWindow.setConfiguredDevices(devices);
  }
);

ipcMain.on(
  DEVICE_CONFIG.UPDATE_DEVICE,
  (_e: IpcMainEvent, updates: DeviceConfigDTO) => {
    const config = DeviceRegistry.get(updates.id);

    if (config) {
      config.applyStub(updates);

      MainWindow.upsertConfiguredDevice(config.toDTO());
    }
  }
);

ipcMain.on(
  DEVICE_CONFIG.DEVICE_PLUGIN_MENU,
  async (e: IpcMainEvent, x: number, y: number, deviceId: string) => {
    // menu item onClick listener
    const onClick = async (m: PluginManifest) => {
      const dev = DeviceRegistry.get(deviceId);

      if (!dev)
        throw new Error(`No config available for deviceId[${deviceId}]`);

      // Dynamically import plugin module, instantiate, register
      const Plugin = await importDeviceSubcomponent(m.title, 'plugin');
      const plugin: BasePlugin = new Plugin(deviceId);
      dev.plugins.push(plugin.id);

      PluginRegistry.register(plugin.id, plugin);

      // Tell the frontend
      MainWindow.upsertPlugin(plugin.toDTO());
      MainWindow.upsertConfiguredDevice(dev.toDTO());
    };

    // show the menu
    const template = await createDevicePluginMenu(onClick);
    const menu = Menu.buildFromTemplate(template);
    const win = BrowserWindow.fromWebContents(e.sender) || undefined;
    menu.popup({ window: win, x, y });
  }
);

ipcMain.on(
  DEVICE_CONFIG.REMOVE_PLUGIN,
  (_e: IpcMainEvent, pluginId: string, deviceConfigId: string) => {
    const config = DeviceRegistry.get(deviceConfigId);

    if (config) {
      config.plugins = config.plugins.filter((p) => p !== pluginId);
      PluginRegistry.deregister(pluginId);

      const allDevices = DeviceRegistry.getAll().map((c) => c.toDTO());
      MainWindow.setConfiguredDevices(allDevices);
    }
  }
);

ipcMain.on(
  DEVICE_CONFIG.SET_CHILD,
  (_e: IpcMainEvent, deviceConfigId: string, childDriverName: string) => {
    const config = DeviceRegistry.get<AdapterDeviceConfig>(deviceConfigId);
    const driver = DRIVERS.get(childDriverName);

    if (!config) throw new Error(`No config found fr ${deviceConfigId}`);
    if (!driver) throw new Error(`No driver found for ${childDriverName}`);

    const child = configFromDriver(
      childDriverName,
      0,
      driver
    ) as SupportedDeviceConfig;
    config.setChild(child);
  }
);
