import { ipcMain, IpcMainEvent } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';

import { PluginIcicle } from './base-plugin';
import { Registry } from './registry';

/**
 * Invoked when a user clicks the power button in its plugin slot
 */
ipcMain.on(
  'update-plugin',
  <T extends PluginIcicle>(_e: IpcMainEvent, deviceId: string, icicle: T) => {
    const plugin = Registry.get(icicle.id);

    if (plugin) {
      plugin.applyIcicle(icicle);

      const dev = ProjectProvider.project.getDevice(deviceId);
      wp.MainWindow.sendConfigStub(deviceId, dev.stub);
    }
  }
);
