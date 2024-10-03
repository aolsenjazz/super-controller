import type { BasePlugin, PluginDTO } from '@shared/plugin-core/base-plugin';

const _Registry = new Map<string, BasePlugin>();

function register(plugin: BasePlugin) {
  _Registry.set(plugin.id, plugin);
}

function deregister(plugin: BasePlugin | PluginDTO | string) {
  const id = typeof plugin === 'string' ? plugin : plugin.id;
  _Registry.delete(id);
}

function get<T extends BasePlugin = BasePlugin>(id: string): T | undefined {
  return _Registry.get(id) as T | undefined;
}

/**
 * Global registry for all plugins in the current project.
 */
export const Registry = {
  register,
  deregister,
  get,
};
