// eslint-disable-next-line @typescript-eslint/naming-convention
type fx = {
  /* Is the effect active immediately? A good example is when there is a solid->brightness effect */
  default?: boolean;

  /* Short string describing the state of the color (Solid, Blink,  etc) */
  title: string;

  /* Label for the configurable effect (Brightness, Speed, etc) */
  effect: string;

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

/**
 * Represents a color which a hardware input can be set to.
 */
type Color = {
  /* Descriptive name for a color, e.g. Red or Amber */
  name: string;

  /* css-valid background-color attribute e.g. #FFF or rgba(100, 100, 100, 0.5) */
  string: string;

  /* The event type which triggers the color. E.g. noteon */
  eventType: StatusString;

  /* The value (velocity) which triggers the color */
  value: MidiNumber;

  fx: fx[];

  /**
   * The number used to identify this light. If unset, inherited from the parent
   * `InputConfig`.
   */
  number?: MidiNumber;

  /**
   * The channel used to identify this light, or an FX selector. see FX for more.
   * If this value isn't set it is inherited from the parent `InputGroup`
   */
  channel?: Channel;

  /* is this the active color when the device is connected? */
  default?: boolean;

  modifier?: 'blink' | 'pulse';
};

export type { Color, fx };
