/**
 * Represents a color which a hardware input can be set to.
 */
export type Color = {
  /* Midi array to be sent to the device to trigger the color */
  array: NumberArrayWithStatus;

  /* Descriptive name for a color, e.g. Red or Amber */
  name: string;

  /* css-valid background-color attribute e.g. #FFF or rgba(100, 100, 100, 0.5) */
  string: string;

  /* Can the color have fx applied to it? */
  effectable: boolean;

  /* is this the active color when the device is connected? */
  default?: boolean;

  modifier?: 'blink' | 'pulse';
};
