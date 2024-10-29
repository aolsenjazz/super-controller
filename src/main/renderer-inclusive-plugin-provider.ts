import { PluginProvider } from '@shared/plugin-provider';
import { WindowProvider } from './window-provider';

import { PluginRegistry } from './registry/plugin-registry';

const { MainWindow } = WindowProvider;

export const RendererInclusivePluginProvider: PluginProvider = {
  get: PluginRegistry.get,
  register: (id, plugin) => {
    PluginRegistry.register(id, plugin);
    MainWindow.upsertPlugin(plugin.toDTO());
  },
};
