import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';
import { BasePluginStatic } from '@plugins/base-plugin-static';
import { allInputPlugins } from '@plugins/plugin-utils';
import { PluginChain } from './plugin-chain';

export class InputPluginChain extends PluginChain {
  protected getAllPlugins(): (BasePlugin<PluginIcicle> & BasePluginStatic)[] {
    return allInputPlugins();
  }
}
