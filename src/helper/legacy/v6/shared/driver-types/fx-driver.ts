/**
 * There is no standard among brands/devices w.r.t how data is used to modulate
 * Fx parameters. Our current understanding based on the APC Key 25 MKII is:
 *
 * - A MIDI message, e.g. [144, 0, 0], is used to set a given pad to red
 * - Modifying the channel of the above message can be used to modulate the brightness,
 *   e.g. [145, 0, 0] or [146, 0, 0]
 * - There is no standard for what fields are used to modulate Fx parameters
 *
 * As such, all 'Fx values' should be thought of as 3-byte MIDI arrays. Fx are sent to devices
 * by summing each element in the Fx array with each element in the current color array, eg:
 *
 * Color red, target pad #32:    [172, 32, 1]
 * Arbitrary brightness value:  +[5,    0, 0]
 * Color with fx applied:        [177, 32, 1]
 */
export type FxDriver = {
  /* Short string describing the state of the color (Solid, Blink,  etc) */
  readonly title: string;

  /* Label for the configurable effect (Brightness, Speed, etc) */
  readonly effect: string;

  /* Acceptable values used to configure this FX */
  readonly validVals: MidiNumber[][];

  /* Default value on device startup */
  readonly defaultVal: MidiNumber[];

  /**
   * Is this effect considered applied when the color is in default state? For example,
   * if brightness is supported, then the brightness fx is likely considered default
   */
  readonly isDefault: boolean;

  /**
   * Assuming most configurable FX are linear, this is the label at the
   * left-hand size of a linear selector (low, slow, etc).
   *
   * If there is only one acceptable value, this FX is effectively binary,
   * and this field can be omitted
   */
  readonly lowBoundLabel?: string;

  /**
   * Assuming most configurable FX are linear, this is the label at the
   * left-hand size of a linear selector (low, slow, etc).
   *
   * If there is only one acceptable value, this FX is effectively binary,
   * and this field can be omitted
   */
  readonly highBoundLabel?: string;
};
