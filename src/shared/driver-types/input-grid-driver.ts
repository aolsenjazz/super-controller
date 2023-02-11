import { Color } from './color';
import { InputDriver } from './input-driver';
import { FxDriver } from './fx-driver';

type InputDefaults = {
  /* MIDI channel */
  readonly channel?: Channel;

  /* MIDI event type */
  readonly eventType?: StatusString;

  /* See InputResponse */
  readonly response?: InputDriver['response'];

  /* Physical shape of the input. circle + square have 1:1 aspect ratio enforced */
  shape?: 'circle' | 'rect' | 'square';

  /* See InputType */
  type?: InputDriver['type'];

  /* Can the input be overridden? `false` if the input does not transmit data to clients */
  overrideable?: boolean;

  /* Height of the input in inches */
  height?: number;

  /* Width of the input in inches */
  width?: number;

  readonly knobType?: 'endless' | 'absolute';

  /**
   * List of `Color`s the child Inputs all support
   */
  availableColors?: Color[];

  availableFx?: FxDriver[];
};

export type InputGridDriver = {
  /** Simple identifier, e.g. Main Pads */
  id: string;

  /**
   * Height of input grid, in inches. It can be helpful to add 2 * margin between
   * individual inputs to get a more accurate representation.
   */
  height: number;

  /**
   * Width of input grid, in inches. It can be helpful to add  2* margin between
   * individual inputs to get a more accurate representation.
   */
  width: number;

  /** # of rows containing hardware inputs */
  nRows: number;

  /** # of hardware inputs per row */
  nCols: number;

  /* Distance from left edge of device in inches */
  left: number;

  /* Distance from bottom edge of device in inches */
  bottom: number;

  /* See `InputDriver` */
  inputs: InputDriver[];

  inputDefaults: InputDefaults;
};
