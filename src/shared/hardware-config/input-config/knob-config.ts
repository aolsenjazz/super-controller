import { KnobDriver } from '../../driver-types/input-drivers/knob-driver';
import { BaseInputConfig, InputDefaults, InputDTO } from './base-input-config';

interface KnobDefaults extends InputDefaults {
  knobType: 'endless' | 'absolute';
}

export interface KnobDTO extends InputDTO<KnobDefaults> {
  valueType: 'absolute' | 'endless';
  type: 'knob';
}

export class KnobConfig extends BaseInputConfig {
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

  public toDTO(): KnobDTO {
    return {
      ...super.toDTO(),
      defaults: this.defaults,
      className: this.constructor.name,
      valueType: this.defaults.knobType, // TODO: this will be buggy
      type: this.type,
    };
  }
}
