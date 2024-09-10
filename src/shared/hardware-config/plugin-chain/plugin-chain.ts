import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';
import { INPUT_PLUGINS } from '@plugins/input-plugins';
import { Registry } from '@plugins/registry';

interface ReadonlyArray<T> {
  readonly [n: number]: T;
  map: <U>(
    callbackFn: (
      value: BasePlugin<PluginIcicle>,
      index: number,
      array: BasePlugin<PluginIcicle>[]
    ) => U
  ) => U[];
}

export abstract class PluginChain {
  private _plugins: BasePlugin[];

  constructor(plugins: BasePlugin[]) {
    this._plugins = plugins;
  }

  public get plugins(): ReadonlyArray<BasePlugin> {
    return this._plugins;
  }

  public reconcile(newPluginList: PluginIcicle[]) {
    // take note of what plugins we already have on this device
    const currentPluginIds = this._plugins.map((p) => p.id);
    const newPluginIds = newPluginList.map((p) => p.id);

    // determine which need to be created + registered/removed + deregistered
    const toAdd = newPluginList.filter((p) => !currentPluginIds.includes(p.id));
    const toRemove = currentPluginIds.filter(
      (id) => !newPluginIds.includes(id)
    );

    // create, registry, add plugins to config as necessary
    toAdd.forEach((p) => {
      const PluginClass = Object.values(INPUT_PLUGINS).filter(
        (plugin) => plugin.TITLE() === p.title
      )[0];
      const plugin = new PluginClass();
      Registry.register(plugin);
      this._plugins.push(plugin);
    });

    // deregister and remove as necessary
    toRemove.forEach((p) => Registry.deregister(p));
    this._plugins = this._plugins.filter((p) => !toRemove.includes(p.id));
  }

  /**
   * Adds a plugin to this `DeviceConfig`s `plugins` array at the end of the arr.
   * `plugin` may be an instance of the plugin, or the plugin's id.
   *
   * TODO: mayyyybbbeeeeee move _plugins to a PluginChain class so we don't need to reuse add,remove,move logic?
   */
  public addPlugin(plugin: BasePlugin) {
    this._plugins.push(plugin);
  }

  /**
   * Removes the plugin from this `DeviceConfig`s `plugins` array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public removePlugin(plugin: BasePlugin | string) {
    const id = plugin instanceof BasePlugin ? plugin.id : plugin;
    const pluginIdx = this._plugins
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((p, _i) => p.id === id)
      .map((_p, i) => i)[0];

    this._plugins.splice(pluginIdx, 1);
  }

  /**
   * Moves the `plugin` to the specified index of the array. `plugin` may be
   * an instance of the plugin, or the plugin's id.
   */
  public movePlugin(plugin: BasePlugin | string, newIdx: number) {
    const id = plugin instanceof BasePlugin ? plugin.id : plugin;
    const oldIdx = this._plugins
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter((p, _i) => p.id === id)
      .map((_p, i) => i)[0];

    const element = this._plugins[oldIdx];
    this._plugins.splice(oldIdx, 1);
    this._plugins.splice(newIdx, 0, element);
  }
}
