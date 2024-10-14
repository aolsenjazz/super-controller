import { PadDriver } from '../../driver-types/input-drivers/pad-driver';
import { BaseInputConfig, InputDefaults } from './base-input-config';

export class PadConfig extends BaseInputConfig {
  public defaults: InputDefaults;

  public type = 'pad' as const;

  constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: PadDriver
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
