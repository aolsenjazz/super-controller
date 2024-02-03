import { Skeleton } from '@shared/revivable';
import { MidiArray } from '@shared/midi-array';
import { XYDriver } from '@shared/driver-types';
import * as Revivable from '@shared/revivable';

import { PitchbendConfig } from './pitchbend-config';
import { SliderConfig } from './slider-config';
import {
  BaseInputConfig,
  InputConfigStub,
  InputState,
} from './base-input-config';
import { MonoInputConfigStub } from './mono-input-config';

export interface XYState extends InputState {
  x: {
    value: number;
  };
  y: {
    value: number;
  };
}

export interface XYConfigStub extends InputConfigStub {
  x: MonoInputConfigStub;
  y: MonoInputConfigStub;
}

@Revivable.register
export class XYConfig extends BaseInputConfig {
  x: SliderConfig | PitchbendConfig;

  y: SliderConfig | PitchbendConfig;

  #nickname?: string;

  static fromDriver(d: XYDriver) {
    const confs = [d.x, d.y].map((driver) => {
      return driver.status === 'pitchbend'
        ? PitchbendConfig.fromDriver(driver)
        : SliderConfig.fromDriver(driver);
    });

    return new XYConfig(confs[0], confs[1]);
  }

  constructor(x: SliderConfig, y: SliderConfig, nickname?: string) {
    super();

    this.x = x;
    this.y = y;
    this.#nickname = nickname;
  }

  toJSON(): Skeleton {
    return {
      name: this.constructor.name,
      args: [this.x, this.y, this.nickname],
    };
  }

  handleMessage(msg: MidiArray) {
    if (this.x.id === msg.asString(true)) {
      return this.x.handleMessage(msg);
    }

    return this.y.handleMessage(msg);
  }

  applyStub(s: XYConfigStub): void {
    this.x.applyStub(s.x);
    this.y.applyStub(s.y);
  }

  isOriginator(msg: MidiArray | NumberArrayWithStatus) {
    return this.x.isOriginator(msg) || this.y.isOriginator(msg);
  }

  get config(): XYConfigStub {
    return {
      id: this.id,
      type: 'xy',
      x: this.x.config,
      y: this.y.config,
      nickname: this.nickname,
    };
  }

  get state(): XYState {
    return {
      x: {
        value: this.x.value,
      },
      y: {
        value: this.y.value,
      },
    };
  }

  get id() {
    return `${this.x.id}${this.y.id}`;
  }

  get nickname() {
    return this.#nickname || `Input ${this.x.number}${this.y.number}`;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }
}
