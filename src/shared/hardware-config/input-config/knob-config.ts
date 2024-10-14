import { MonoInputConfig, InputDefault } from './mono-input-config';
import type { MonoInputDTO } from './mono-input-dto';
import { KnobDriver } from '../../driver-types/input-drivers/knob-driver';

export interface KnobDTO extends MonoInputDTO<KnobDefaults> {
  valueType: 'absolute' | 'endless';
  type: 'knob';
}

interface KnobDefaults extends InputDefault {
  knobType: 'endless' | 'absolute';
}

export class KnobConfig extends MonoInputConfig<
  KnobDefaults,
  KnobDTO,
  KnobDriver
> {
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
      className: this.constructor.name,
      valueType: this.defaults.knobType, // TODO: this will be buggy
      type: this.type,
    };
  }
}
