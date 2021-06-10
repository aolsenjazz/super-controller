import { Channel } from 'midi-message-parser';

export type KeyboardDriver = {
  /** The octaves which the lowest C on the keyboard belongs too, should be -2 < defaultOctave < 8 */
  defaultOctave: number;

  /** Does not support partial octaves. Must be an integer */
  nOctaves: number;

  /** The midi channel keyboard events are transmitted on */
  channel: Channel;

  width: number;

  height: number;

  left: number;

  bottom: number;
};
