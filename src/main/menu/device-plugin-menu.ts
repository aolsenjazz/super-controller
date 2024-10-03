import { MenuItem } from 'electron';

import { WindowProvider } from '@main/window-provider';
import {
  getDeviceManifests,
  importDeviceSubcomponent,
} from '@plugins/plugin-loader';
import type { BasePlugin } from '@shared/plugin-core/base-plugin';
import { PluginRegistry } from '@main/plugin-registry';
import { DeviceRegistry } from '@main/device-registry';

export async function createDevicePluginMenu(deviceId: string) {
  const manifests = await getDeviceManifests();

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: async () => {
        const dev = DeviceRegistry.get(deviceId)!;
        const Plugin = await importDeviceSubcomponent(m.title, 'plugin');
        const plugin: BasePlugin = new Plugin(m.title, m.description);
        dev.plugins.push(plugin.id);
        PluginRegistry.register(plugin.id, plugin);
        WindowProvider.MainWindow.sendConfigStub(dev.id, dev.toDTO());
      },
    });
  });
}
