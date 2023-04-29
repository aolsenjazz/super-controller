import { Skeleton } from '@shared/revivable';
import { MidiArray } from '@shared/midi-array';
import { XYDriver } from '@shared/driver-types';

import { PitchbendConfig } from './pitchbend-config';
import { SliderConfig } from './slider-config';
import { BaseInputConfig } from './base-input-config';

export class XYConfig extends BaseInputConfig {
  x: SliderConfig;

  y: SliderConfig;

  #nickname?: string;

  static fromDriver(d: XYDriver) {
    const confs = [d.x, d.y].map((driver) => {
      return driver.status === 'pitchbend'
        ? PitchbendConfig.fromDriver(d.x)
        : SliderConfig.fromDriver(d.x);
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
    if (this.x.id === msg.id(true)) {
      return this.x.handleMessage(msg);
    }

    return this.y.handleMessage(msg);
  }

  restoreDefaults() {
    this.x.restoreDefaults();
    this.y.restoreDefaults();
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
