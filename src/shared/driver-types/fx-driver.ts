export type FxDriver = {
  /* Is the effect active immediately? A good example is when there is a solid->brightness effect */
  default?: boolean;

  /* Short string describing the state of the color (Solid, Blink,  etc) */
  title: string;

  /* Label for the configurable effect (Brightness, Speed, etc) */
  effect: string;

  /* The portion of the midi message to which this fx value must be applied */
  target: 'number' | 'channel' | 'value';

  /* Acceptable values used to configure this FX */
  validVals: Channel[];

  /* Default value on device startup */
  defaultVal: Channel;

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
