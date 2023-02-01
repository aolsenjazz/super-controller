// eslint-disable-next-line @typescript-eslint/naming-convention
/**
 * Represents a color which a hardware input can be set to.
 */
export type Color = {
  /* Descriptive name for a color, e.g. Red or Amber */
  name: string;

  /* css-valid background-color attribute e.g. #FFF or rgba(100, 100, 100, 0.5) */
  string: string;

  /* The event type which triggers the color. E.g. noteon */
  eventType: StatusString;

  /* The value (velocity) which triggers the color */
  value: MidiNumber;

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
