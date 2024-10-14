import { InputDefault, MonoInputConfig } from './mono-input-config';
import type { MonoInputDTO } from './mono-input-dto';
import { MonoInteractiveDriver } from '../../driver-types/input-drivers/mono-interactive-driver';

export class SliderConfig extends MonoInputConfig {
  public defaults: InputDefault;

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

  public toDTO(): MonoInputDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
    };
  }
}
