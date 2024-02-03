import { MidiArray } from '@shared/midi-array';
import { XYDriver } from '@shared/driver-types';

import { PitchbendConfig } from './pitchbend-config';
import { SliderConfig } from './slider-config';
import { BaseInputConfig, InputIcicle, InputState } from './base-input-config';
import { MonoInputIcicle } from './mono-input-config';

export interface XYState extends InputState {
  x: {
    value: number;
  };
  y: {
    value: number;
  };
}

export interface XYIcicle extends InputIcicle {
  x: MonoInputIcicle;
  y: MonoInputIcicle;
}

export class XYConfig extends BaseInputConfig<XYIcicle> {
  x: SliderConfig | PitchbendConfig;

  y: SliderConfig | PitchbendConfig;

  static fromDriver(d: XYDriver) {
    const confs = [d.x, d.y].map((driver) => {
      return driver.status === 'pitchbend'
        ? PitchbendConfig.fromDriver(driver)
        : SliderConfig.fromDriver(driver);
    });

    return new XYConfig('', confs[0], confs[1]);
  }

  constructor(
    nickname: string,
    x: SliderConfig | PitchbendConfig,
    y: SliderConfig | PitchbendConfig
  ) {
    super(nickname);

    this.x = x;
    this.y = y;
  }

  handleMessage(msg: MidiArray) {
    if (this.x.id === msg.asString(true)) {
      return this.x.handleMessage(msg);
    }

    return this.y.handleMessage(msg);
  }

  applyStub(s: XYIcicle): void {
    this.x.applyStub(s.x);
    this.y.applyStub(s.y);
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    return this.x.isOriginator(msg) || this.y.isOriginator(msg);
  }

  get type() {
    return 'xy' as const;
  }

  public freeze() {
    return {
      ...this.innerFreeze(),
      className: this.constructor.name,
      x: this.x.freeze(),
      y: this.y.freeze(),
    };
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
    return `${this.x.id}${this.y.id}`;
  }
}
