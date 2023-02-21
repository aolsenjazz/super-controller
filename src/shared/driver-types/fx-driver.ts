export type FxDriver = {
  /* Short string describing the state of the color (Solid, Blink,  etc) */
  title: string;

  /* Label for the configurable effect (Brightness, Speed, etc) */
  effect: string;

  /**
   * Is this effect considered applied when the color is in default state? For example,
   * if brightness is supported, then the brightness fx is likely considered default
   */
  isDefault: boolean;

  /* Acceptable values used to configure this FX */
  validVals: MidiNumber[][];

  /* Default value on device startup */
  defaultVal: MidiNumber[];

  /**
   * Assuming most configurable FX are linear, this is the label at the
   * left-hand size of a linear selector (low, slow, etc).
   *
   * If there is only one acceptable value, this FX is effectively binary,
   * and this field can be omitted
   */
  lowBoundLabel?: string;

  /**
   * Assuming most configurable FX are linear, this is the label at the
   * left-hand size of a linear selector (low, slow, etc).
   *
   * If there is only one acceptable value, this FX is effectively binary,
   * and this field can be omitted
   */
  highBoundLabel?: string;
};
