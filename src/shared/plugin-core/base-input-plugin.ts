import { BaseInteractiveInputDriver } from '@shared/driver-types/input-drivers/base-interactive-input-driver';

import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseInputPlugin<
  T extends PluginDTO = PluginDTO
> extends BasePlugin<T> {
  protected driver: BaseInteractiveInputDriver;

  constructor(
    title: string,
    description: string,
    parentId: string,
    driver: BaseInteractiveInputDriver
  ) {
    super(title, description, parentId);

    this.driver = driver;
  }
}
