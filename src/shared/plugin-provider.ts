import type { BasePlugin } from '../plugins/core/base-plugin';

export interface PluginProvider {
  get: (pluginId: string) => BasePlugin | undefined;
  register: (id: string, plugin: BasePlugin) => void;
}
