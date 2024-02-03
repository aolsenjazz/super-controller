import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';
import { BasePluginStatic } from '@plugins/base-plugin-static';
import { allDevicePlugins } from '@plugins/plugin-utils';
import { PluginChain } from './plugin-chain';

export class DevicePluginChain extends PluginChain {
  protected getAllPlugins(): (BasePlugin<PluginIcicle> & BasePluginStatic)[] {
    return allDevicePlugins();
  }
}
