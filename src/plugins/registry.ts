import { BasePlugin } from './base-plugin';

// eslint-disable-next-line @typescript-eslint/naming-convention
const _Registry = new Map<string, BasePlugin>();

function register(plugin: BasePlugin) {
  _Registry.set(plugin.id, plugin);
}

function deregister(plugin: BasePlugin) {
  _Registry.delete(plugin.id);
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
