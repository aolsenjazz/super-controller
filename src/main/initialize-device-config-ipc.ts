import { ipcMain, IpcMainEvent } from 'electron';

import { DeviceConfigDTO } from '@shared/hardware-config/device-config';
import { Registry } from '@plugins/registry';

import { CONFIG, DEVICE_CONFIG } from './ipc-channels';
import { ProjectProvider, ProjectProviderEvent } from './project-provider';

ipcMain.on(
  CONFIG.UPDATE_DEVICE,
  (_e: IpcMainEvent, updates: DeviceConfigDTO) => {
    const { project } = ProjectProvider;
    const config = project.getDevice(updates.id)!;

    config.applyStub(updates);

    ProjectProvider.emit(ProjectProviderEvent.DevicesChanged, {
      changed: [config],
      project,
      action: 'update',
    });
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

      ProjectProvider.emit(ProjectProviderEvent.DevicesChanged, {
        changed: [config],
        project,
        action: 'update',
      });
    }
  }
);
