import { MessageProcessorMeta } from '@shared/message-processor';
import { getQualifiedInputId } from '@shared/util';

import { idForMsg } from '../../midi-util';
import { XYDriver } from '../../driver-types/input-drivers/xy-driver';

import { PitchbendConfig } from './pitchbend-config';
import { SliderConfig } from './slider-config';
import { BaseInputConfig, InputDTO, InputState } from './base-input-config';
import type { MonoInputDTO } from './mono-input-dto';

export interface XYState extends InputState {
  x: {
    value: number;
  };
  y: {
    value: number;
  };
}

export interface XYDTO extends InputDTO {
  x: MonoInputDTO;
  y: MonoInputDTO;
}

export class XYConfig extends BaseInputConfig<XYDTO> {
  x: SliderConfig | PitchbendConfig;

  y: SliderConfig | PitchbendConfig;

  constructor(deviceId: string, nickname: string, driver: XYDriver) {
    super(deviceId, nickname, driver);

    const XConfig =
      driver.x.status === 'pitchbend' ? PitchbendConfig : SliderConfig;
    const YConfig =
      driver.y.status === 'pitchbend' ? PitchbendConfig : SliderConfig;

    this.x = new XConfig(deviceId, '', driver.x);
    this.y = new YConfig(deviceId, '', driver.y);
  }

  public init() {
    // noop, for now
  }

  handleMessage(msg: NumberArrayWithStatus) {
    if (this.x.id === idForMsg(msg, true)) {
      return this.x.handleMessage(msg);
    }

    return this.y.handleMessage(msg);
  }

  applyStub(s: XYDTO): void {
    this.x.applyStub(s.x);
    this.y.applyStub(s.y);
  }

  isOriginator(msg: NumberArrayWithStatus) {
    return this.x.isOriginator(msg) || this.y.isOriginator(msg);
  }

  get type() {
    return 'xy' as const;
  }

  public toDTO(): XYDTO {
    return {
      ...this.toDTO(),
      className: this.constructor.name,
      x: this.x.toDTO(),
      y: this.y.toDTO(),
    };
  }

  public process(
    msg: NumberArrayWithStatus,
    _meta: MessageProcessorMeta
  ): NumberArrayWithStatus | undefined {
    return msg;
  }

  get state(): XYState {
    return {
      x: {
        // value: this.x.value,
        value: 0, // TODO:
      },
      y: {
        // value: this.y.value,
        value: 0, // TOOD:
      },
    };
  }

  get id() {
    return `${this.x.id}/${this.y.id}`;
  }

  get qualifiedId() {
    return getQualifiedInputId(this.deviceId, this.id);
  }
}
