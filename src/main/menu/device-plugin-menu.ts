import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { Registry } from '@plugins/registry';
import {
  getDeviceManifests,
  importDeviceSubcomponent,
} from '@plugins/plugin-loader';
import type { BasePlugin } from '@shared/plugin-core/base-plugin';

export async function createDevicePluginMenu(deviceId: string) {
  const manifests = await getDeviceManifests();

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: async () => {
        const dev = ProjectProvider.project.getDevice(deviceId);
        const Plugin = await importDeviceSubcomponent(m.title, 'plugin');
        const plugin: BasePlugin = new Plugin(m.title, m.description);
        dev.plugins.push(plugin.id);
        Registry.register(plugin);
        wp.MainWindow.sendConfigStub(dev.id, dev.toDTO());
      },
    });
  });
}
