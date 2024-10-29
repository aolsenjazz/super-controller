import type { MonoInteractiveDriver } from '../types';

import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseInputPlugin<
  T extends PluginDTO = PluginDTO,
> extends BasePlugin<T> {
  protected driver: MonoInteractiveDriver;

  public type = 'input' as const;

  public static fromDTO(
    _dto: PluginDTO,
    _driver: BaseInputPlugin['driver'],
  ): BaseInputPlugin {
    throw new Error('fromDTO is not implemented in derived class!');
  }

  public constructor(
    title: string,
    description: string,
    parentId: string,
    driver: BaseInputPlugin['driver'],
    id?: string,
  ) {
    super(title, description, parentId, id);

    this.driver = driver;
  }
}
