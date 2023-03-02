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
