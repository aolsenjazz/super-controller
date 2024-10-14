import { MonoInteractiveDriver } from '../../driver-types/input-drivers/mono-interactive-driver';
import { BaseInputConfig, InputDefaults } from './base-input-config';

export class SliderConfig extends BaseInputConfig {
  public defaults: InputDefaults;

  public type = 'slider' as const;

  constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: MonoInteractiveDriver
  ) {
    super(deviceId, nickname, plugins, driver);

    this.defaults = {
      number: driver.number,
      channel: driver.channel,
      statusString: driver.status,
      response: driver.response,
    };
  }

  public toDTO() {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
    };
  }
}
