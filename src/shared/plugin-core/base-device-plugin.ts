import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseDevicePlugin<
  T extends PluginDTO = PluginDTO
> extends BasePlugin<T> {
  protected type = 'device' as const;

  public static fromDTO(_dto: PluginDTO): BaseDevicePlugin {
    throw new Error('fromDTO is not implemented in derived class!');
  }
}
