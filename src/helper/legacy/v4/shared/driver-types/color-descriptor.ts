/**
 * Subset of color fields. Contains visually descriptive information,
 * omitting MIDI data to prevent the sending of MIDI color information
 * without the application of potential FX
 */
export type ColorDescriptor = {
  /* Descriptive name for a color, e.g. Red or Amber */
  name: string;

  /* css-valid background-color attribute e.g. #FFF or rgba(100, 100, 100, 0.5) */
  string: string;

  /* Can the color have fx applied to it? */
  effectable: boolean;

  modifier?: 'blink' | 'pulse';
};
