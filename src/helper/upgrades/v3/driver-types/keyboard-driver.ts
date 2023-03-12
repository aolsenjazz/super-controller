export type KeyboardDriver = {
  /* The octaves which the lowest C on the keyboard belongs too, will be -2 < defaultOctave < 8 */
  defaultOctave: number;

  /* Does not support partial octaves. Must be an integer */
  nOctaves: number;

  /* The midi channel keyboard events are transmitted on */
  channel: Channel;

  /* Width, in inches, of the keyboard */
  width: number;

  /* Height, in inches, of the keyboard */
  height: number;

  /* Distance, in inches, from left edge of device */
  left: number;

  /* Distance, in inches, from bottom edge of device */
  bottom: number;

  /**
   * Does the keyboard transmit data? Some devices have separate ports for keyboard
   * and other inputs, so a keyboard may not necessarily transmit for a given port.
   */
  enabled: boolean;
};
