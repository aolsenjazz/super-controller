import { PluginProvider } from '@shared/plugin-provider';

import { PluginRegistry } from './registry/plugin-registry';
import { WindowProvider } from './window-provider';

const { MainWindow } = WindowProvider;

export const RendererInclusivePluginProvider: PluginProvider = {
  get: PluginRegistry.get,
  register: (id, plugin) => {
    PluginRegistry.register(id, plugin);
    MainWindow.upsertPlugin(plugin.toDTO());
  },
};
