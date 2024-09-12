import { BasePlugin, PluginIcicle } from '@plugins/base-plugin';
import { BasePluginStatic } from '@plugins/base-plugin-static';
import BacklightControlPlugin from './backlight-control';
import BasicOverridePlugin from './basic-override';

type PluginConstructor<T extends PluginIcicle = PluginIcicle> =
  new () => BasePlugin<T>;

export const INPUT_PLUGINS: Record<
  string,
  PluginConstructor & BasePluginStatic
> = {
  BacklightControl: BacklightControlPlugin,
  BasicOverride: BasicOverridePlugin,
};
