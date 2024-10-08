import { MenuItem } from 'electron';

import { WindowProvider } from '@main/window-provider';
import {
  getDeviceManifests,
  importDeviceSubcomponent,
} from '@plugins/plugin-loader';
import type { BasePlugin } from '@shared/plugin-core/base-plugin';
import { PluginRegistry } from '@main/plugin-registry';
import { DeviceRegistry } from '@main/device-registry';
import type { PluginManifest } from '@shared/plugin-core/plugin-manifest';

export async function createDevicePluginMenu(deviceId: string) {
  const manifests = await getDeviceManifests();

  const onClick = async (m: PluginManifest) => {
    const dev = DeviceRegistry.get(deviceId);

    if (!dev) throw new Error(`No config available for deviceId[${deviceId}]`);

    // Dynamically import plugin module, instantiate, register
    const Plugin = await importDeviceSubcomponent(m.title, 'plugin');
    const plugin: BasePlugin = new Plugin(m.title, m.description);
    dev.plugins.push(plugin.id);

    PluginRegistry.register(plugin.id, plugin);

    // Tell the frontend
    WindowProvider.MainWindow.sendReduxEvent({
      type: 'configuredDevices/upsertOne',
      payload: dev.toDTO(),
    });
  };

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: () => onClick(m),
    });
  });
}
