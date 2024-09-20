import { BasePlugin } from './plugin-core/base-plugin';

export interface PluginProvider {
  get: (pluginId: string) => BasePlugin | undefined;
}
