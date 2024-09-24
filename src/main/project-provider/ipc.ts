import { Anonymous, getDriver } from '@shared/drivers';
import { configFromDriver } from '@shared/hardware-config';
import { ipcMain, IpcMainEvent } from 'electron';

import { CONFIG } from '../ipc-channels';
import { ProjectProviderEvent, ProjectProvider } from './index';

ipcMain.on(
  CONFIG.ADD_DEVICE,
  (
    _e: IpcMainEvent,
    deviceName: string,
    siblingIdx: number,
    driverName?: string
  ) => {
    const { project } = ProjectProvider;
    const driver = getDriver(driverName || deviceName) || Anonymous;
    const conf = configFromDriver(deviceName, siblingIdx, driver);

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
