/* eslint-disable no-bitwise */
import { MonoInputConfig } from './mono-input-config';
import { InputDriverWithHandle } from '../../driver-types';
import { InputState } from './base-input-config';

export interface SliderState extends InputState {
  value: MidiNumber;
}

export class SliderConfig extends MonoInputConfig {
  static fromDriver(d: InputDriverWithHandle) {
    const def = {
      number: d.number,
      channel: d.channel,
      statusString: d.status,
      response: d.response,
    };

    return new SliderConfig('', [], def);
  }

  get type() {
    return 'slider' as const;
  }

  get state() {
    return {
      value: 0, // TODO:
    };
  }
}
