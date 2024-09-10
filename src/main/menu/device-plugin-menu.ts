import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { DEVICE_PLUGINS } from '@plugins/device-plugins';
import { Registry } from '@plugins/registry';

export function createDevicePluginMenu(deviceId: string) {
  return Object.values(DEVICE_PLUGINS).map((Plugin) => {
    return new MenuItem({
      label: Plugin.TITLE(),
      toolTip: Plugin.DESCRIPTION(),
      click: () => {
        const dev = ProjectProvider.project.getDevice(deviceId);
        const plug = new Plugin();
        dev.addPlugin(plug);
        Registry.register(plug);
        wp.MainWindow.sendConfigStub(dev.id, dev.stub());
      },
    });
  });
}
