import { ipcMain, IpcMainEvent } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';

import { PluginDTO } from '@shared/plugin-core/base-plugin';
import { Registry } from './registry';

/**
 * Invoked when a user clicks the power button in its plugin slot
 */
ipcMain.on(
  'update-plugin',
  <T extends PluginDTO>(_e: IpcMainEvent, deviceId: string, icicle: T) => {
    const plugin = Registry.get(icicle.id);

    if (plugin) {
      plugin.applyDTO(icicle);

      const dev = ProjectProvider.project.getDevice(deviceId);
      wp.MainWindow.sendConfigStub(deviceId, dev.stub());
    }
  }
);
