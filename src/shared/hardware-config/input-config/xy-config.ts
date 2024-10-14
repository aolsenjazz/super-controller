import { MessageProcessorMeta } from '../../message-processor';
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

  isOriginator(msg: NumberArrayWithStatus) {
    return this.x.isOriginator(msg) || this.y.isOriginator(msg);
  }

  public toDTO(): XYDTO {
    return {
      ...super.toDTO(),
      className: this.constructor.name,
      x: this.x.toDTO(),
      y: this.y.toDTO(),
    };
  }

  public process(
    msg: NumberArrayWithStatus,
    meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined {
    if (this.x.isOriginator(msg)) return this.x.process(msg, meta);

    return this.y.process(msg, meta);
  }
}
