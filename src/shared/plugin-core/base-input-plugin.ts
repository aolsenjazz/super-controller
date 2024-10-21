import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';

import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseInputPlugin<
  T extends PluginDTO = PluginDTO
> extends BasePlugin<T> {
  protected driver: MonoInteractiveDriver;

  constructor(
    title: string,
    description: string,
    parentId: string,
    driver: MonoInteractiveDriver
  ) {
    super(title, description, parentId);

    this.driver = driver;
  }
}
