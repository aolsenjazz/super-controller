import { XYDriver } from '../../driver-types/input-drivers/xy-driver';

import { PitchbendConfig } from './pitchbend-config';
import { SliderConfig } from './slider-config';
import { BaseInputConfig, InputDTO } from './base-input-config';
import type { MonoInputDTO } from './mono-input-dto';

export interface XYDTO extends InputDTO {
  x: MonoInputDTO;
  y: MonoInputDTO;
}

export class XYConfig extends BaseInputConfig<XYDTO, XYDriver> {
  public x: SliderConfig | PitchbendConfig;

  public y: SliderConfig | PitchbendConfig;

  public type = 'xy' as const;

  constructor(deviceId: string, nickname: string, driver: XYDriver) {
    super(deviceId, nickname, driver);
    const XConfig =
      driver.x.status === 'pitchbend' ? PitchbendConfig : SliderConfig;
    const YConfig =
      driver.y.status === 'pitchbend' ? PitchbendConfig : SliderConfig;

    this.x = new XConfig(deviceId, '', [], driver.x);
    this.y = new YConfig(deviceId, '', [], driver.y);
  }

  public init() {
    // noop, for now
  }

  applyStub(s: XYDTO): void {
    this.x.applyStub(s.x);
    this.y.applyStub(s.y);
  }

  public toDTO(): XYDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      x: this.x.toDTO(),
      y: this.y.toDTO(),
    };
  }

  public process(): NumberArrayWithStatus | undefined {
    throw new Error(
      'It is not the job of the XY config to pass midi messages to its children'
    );
  }
}
