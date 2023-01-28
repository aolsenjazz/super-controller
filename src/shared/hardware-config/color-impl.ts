// eslint-disable-next-line max-classes-per-file
import { setStatus, setChannel } from '@shared/midi-util';

import { Color, fx as FX } from '../driver-types/color';

export class ColorImpl implements Color {
  activeFx?: FX;

  fxVal?: number;

  readonly name: string;

  readonly string: string;

  readonly eventType: StatusString;

  readonly value: number;

  readonly number: number;

  readonly channel: number;

  readonly fx: FX[];

  readonly default: boolean;

  readonly modifier?: 'blink' | 'pulse';

  constructor(c: Color, parentNumber: number, parentChannel: Channel) {
    this.name = c.name;
    this.string = c.string;
    this.eventType = c.eventType;
    this.value = c.value;
    this.fx = c.fx;
    this.default = c.default || false;

    this.number = c.number || parentNumber;
    this.channel = c.channel || parentChannel;
    this.modifier = c.modifier;
  }

  toMidiArray() {
    const unmodified = setStatus(
      [this.channel, this.number, this.value],
      this.eventType
    );

    if (this.activeFx && this.fxVal) {
      // apply fx
      setChannel(unmodified, this.fxVal);
    }

    return unmodified;
  }

  toDefaultMidiArray() {
    return setStatus([this.channel, this.number, this.value], this.eventType);
  }

  setFx(title: string) {
    this.fx.forEach((fx) => {
      if (fx.title === title) {
        this.activeFx = fx;
        this.fxVal = fx.defaultVal;
      }
    });
  }
}
