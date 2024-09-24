import { ipcMain, IpcMainEvent } from 'electron';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { Registry } from '@plugins/registry';
import {
  AdapterDeviceConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';

import { DRIVERS } from '@shared/drivers';
import { CONFIG, DEVICE_CONFIG } from './ipc-channels';
import { ProjectProvider } from './project-provider';

import { wp } from './window-provider';

const { MainWindow } = wp;

/* When a device is removed from project, remove it here and re-init all devices */
ipcMain.on(CONFIG.GET_CONFIGURED_DEVICES, (e: IpcMainEvent) => {
  const { project } = ProjectProvider;
  e.returnValue = project.devices.map((d) => d.id);
});

ipcMain.on(
  CONFIG.UPDATE_DEVICE,
  (_e: IpcMainEvent, updates: DeviceConfigDTO) => {
    const { project } = ProjectProvider;
    const config = project.getDevice(updates.id);

    if (config) {
      config.applyStub(updates);
      MainWindow.sendConfigStub(config.id, config.toDTO());
    }
  }
);

ipcMain.on(
  DEVICE_CONFIG.REMOVE_PLUGIN,
  (_e: IpcMainEvent, pluginId: string, deviceConfigId: string) => {
    const { project } = ProjectProvider;
    const config = project.getDevice(deviceConfigId);

    if (config) {
      config.plugins = config.plugins.filter((p) => p !== pluginId);
      Registry.deregister(pluginId);

      wp.MainWindow.sendConfigStub(config.id, config.toDTO());
    }
  }
);

ipcMain.on(
  DEVICE_CONFIG.SET_CHILD,
  (_e: IpcMainEvent, deviceConfigId: string, childId: string) => {
    const { project } = ProjectProvider;
    const config = project.getDevice(deviceConfigId);

    if (!(config instanceof AdapterDeviceConfig)) {
      throw new Error(
        `${deviceConfigId} is not an instance of adapterdeviceconfig`
      );
    }

    const driver = DRIVERS.get(childId);

    if (!driver) throw new Error(`No driver found for ${childId}`);

    const child = configFromDriver(childId, 0, driver) as SupportedDeviceConfig;
    config.setChild(child);

    MainWindow.sendConfigStub(config.id, config.toDTO());
  }
);
