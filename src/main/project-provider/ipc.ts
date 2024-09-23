import { Anonymous, getDriver } from '@shared/drivers';
import {
  AdapterDeviceConfig,
  configFromDriver,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { ipcMain, IpcMainEvent } from 'electron';

import { CONFIG } from '../ipc-channels';
import { ProjectProviderEvent, ProjectProvider } from './index';

ipcMain.on(
  CONFIG.ADD_DEVICE,
  (
    _e: IpcMainEvent,
    deviceName: string,
    siblingIdx: number,
    driverName?: string,
    childName?: string
  ) => {
    const { project } = ProjectProvider;
    const driver = getDriver(driverName || deviceName) || Anonymous;
    const conf = configFromDriver(deviceName, siblingIdx, driver);

    if (conf instanceof AdapterDeviceConfig) {
      if (childName === undefined) throw new Error('must provide child name');

      const childDriver = getDriver(childName)!;
      const childConf = configFromDriver(childName!, siblingIdx, childDriver);
      conf.setChild(childConf as SupportedDeviceConfig);
    }

    project.addDevice(conf);

    ProjectProvider.emit(ProjectProviderEvent.DevicesChanged, {
      changed: [conf],
      project,
      action: 'add',
    });
  }
);

ipcMain.on(CONFIG.REMOVE_DEVICE, (_e: IpcMainEvent, deviceId: string) => {
  const { project } = ProjectProvider;
  const config = project.getDevice(deviceId)!;
  project.removeDevice(config);

  ProjectProvider.emit(ProjectProviderEvent.DevicesChanged, {
    changed: [config],
    project,
    action: 'remove',
  });
});
