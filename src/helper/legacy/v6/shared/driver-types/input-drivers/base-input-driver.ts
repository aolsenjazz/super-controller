/* Input type */
export type InputType = 'pad' | 'knob' | 'slider' | 'wheel' | 'xy' | 'switch';

export type InputShape = 'circle' | 'rect';

export interface BaseInputDriver {
  /* Physical shape of the input. circle + square have 1:1 aspect ratio enforced */
  readonly shape: InputShape;

  /* See InputType */
  readonly type: InputType;

  /* Can the input be overridden? `false` if the input does not transmit data to clients */
  readonly interactive: boolean;

  /* Height of the input in inches */
  readonly height: number;

  /* Width of the input in inches */
  readonly width: number;
}
