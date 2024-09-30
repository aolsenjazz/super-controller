import { InputDriver } from '../driver-types';
import { BasePlugin, PluginDTO } from './base-plugin';

export abstract class BaseInputPlugin<
  T extends PluginDTO = PluginDTO
> extends BasePlugin<T> {
  protected driver: InputDriver;

  constructor(title: string, description: string, driver: InputDriver) {
    super(title, description);

    this.driver = driver;
  }
}
