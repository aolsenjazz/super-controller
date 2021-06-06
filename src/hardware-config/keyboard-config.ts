import { Channel } from 'midi-message-parser';

import { KeyboardDriver } from '../driver-types';

export class KeyboardConfig {
  /* The octave of the lowest key */
  defaultOctave: number;

  /* Number of octaves in keyboard */
  nOctaves: number;

  /* Channel on which keyboard MIDI events are transmitted */
  channel: Channel;

  static fromDriver(driver?: KeyboardDriver) {
    return driver
      ? new KeyboardConfig(
          driver.nOctaves,
          driver.defaultOctave,
          driver.channel
        )
      : undefined;
  }

  static fromParsedJSON(obj?: KeyboardDriver) {
    if (obj === undefined) return undefined;

    return new KeyboardConfig(obj.nOctaves, obj.defaultOctave, obj.channel);
  }

  constructor(nOctaves: number, defaultOctave: number, channel: Channel) {
    this.nOctaves = nOctaves;
    this.defaultOctave = defaultOctave;
    this.channel = channel;
  }
}
