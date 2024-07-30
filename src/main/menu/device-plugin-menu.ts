import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { allDevicePlugins } from '@plugins/plugin-utils';
import { Registry } from '@plugins/registry';

export function createDevicePluginMenu(deviceId: string) {
  return allDevicePlugins().map((Plugin) => {
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
