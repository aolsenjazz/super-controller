import { BaseInputDriver } from '../driver-types/input-drivers/base-input-driver';
import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseInputPlugin<
  T extends PluginDTO = PluginDTO
> extends BasePlugin<T> {
  protected driver: BaseInputDriver;

  constructor(title: string, description: string, driver: BaseInputDriver) {
    super(title, description);

    this.driver = driver;
  }
}
