import { KnobDriver } from '../../driver-types/input-drivers/knob-driver';
import { InputDefault, MonoInputConfig } from './mono-input-config';
import { MonoInputDTO } from './mono-input-dto';

interface KnobDefaults extends InputDefault {
  knobType: 'endless' | 'absolute';
}

export interface KnobDTO extends MonoInputDTO<KnobDefaults> {
  valueType: 'absolute' | 'endless';
  type: 'knob';
}

export class KnobConfig extends MonoInputConfig {
  public defaults: KnobDefaults;

  public type = 'knob' as const;

  public constructor(
    deviceId: string,
    nickname: string,
    plugins: string[],
    driver: KnobDriver
  ) {
    super(deviceId, nickname, plugins, driver);

    this.defaults = {
      number: driver.number,
      channel: driver.channel,
      statusString: driver.status,
      response: driver.response,
      knobType: driver.knobType,
    };
  }

  public applyStub(s: KnobDTO) {
    super.applyStub(s);
  }

  public toDTO() {
    return {
      ...super.toDTO(),
      defaults: this.defaults,
      className: this.constructor.name,
      valueType: this.defaults.knobType,
      type: this.type,
    };
  }
}
