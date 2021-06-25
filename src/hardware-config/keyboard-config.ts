import { Channel } from 'midi-message-parser';

import { KeyboardDriver } from '../driver-types';

export class KeyboardConfig {
  /* The octave of the lowest key */
  defaultOctave: number;

  /* Number of octaves in keyboard */
  nOctaves: number;

  /* Channel on which keyboard MIDI events are transmitted */
  channel: Channel;

  /**
   * Constructs a new KeyboardConfig from driver, or returns undefined
   *
   * @param { KeyboardDriver | undefined } driver The keyboard driver
   * @return { KeyboardConfig } A new instance of KeyboardConfig
   */
  static fromDriver(driver?: KeyboardDriver) {
    return driver
      ? new KeyboardConfig(
          driver.nOctaves,
          driver.defaultOctave,
          driver.channel
        )
      : undefined;
  }

  /**
   * Constructs a new KeyboardConfig from JSON, or returns undefined.
   *
   * @param { KeyboardDriver | undefined } obj The driver
   * @return { KeyboardConfig | undefined } A new instance or undefined
   */
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
