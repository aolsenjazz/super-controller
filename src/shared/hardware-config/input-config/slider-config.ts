import { InputDefault, MonoInputConfig } from './mono-input-config';
import { InputState } from './base-input-config';
import type { MonoInputDTO } from './mono-input-dto';
import { MonoInteractiveDriver } from '../../driver-types/input-drivers/mono-interactive-driver';

export interface SliderState extends InputState {
  value: MidiNumber;
}

export class SliderConfig extends MonoInputConfig {
  public defaults: InputDefault;

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

  get type() {
    return 'slider' as const;
  }

  get state() {
    return {
      value: 0, // TODO:
    };
  }
}
