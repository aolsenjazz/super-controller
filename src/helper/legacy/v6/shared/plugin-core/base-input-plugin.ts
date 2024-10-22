import { MonoInteractiveDriver } from '../driver-types/input-drivers/mono-interactive-driver';

import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseInputPlugin<
  T extends PluginDTO = PluginDTO
> extends BasePlugin<T> {
  protected driver: MonoInteractiveDriver;

  protected type = 'input' as const;

  public static fromDTO(
    _dto: PluginDTO,
    _driver: MonoInteractiveDriver
  ): BaseInputPlugin {
    throw new Error('fromDTO is not implemented in derived class!');
  }

  public constructor(
    title: string,
    description: string,
    parentId: string,
    driver: MonoInteractiveDriver
  ) {
    super(title, description, parentId);

    this.driver = driver;
  }
}
