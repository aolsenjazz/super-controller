/* eslint-disable prefer-destructuring */
/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';

import { Color } from '../driver-types/color';

@Revivable.register
export class ColorImpl {
  readonly #array: MidiArray;

  readonly name: string;

  readonly string: string;

  readonly isDefault: boolean;

  readonly modifier?: 'blink' | 'pulse';

  constructor(c: Color) {
    this.#array = create(c.array);
    this.name = c.name;
    this.string = c.string;
    this.isDefault = c.default || false;
    this.modifier = c.modifier;
  }

  get array(): NumberArrayWithStatus {
    return JSON.parse(JSON.stringify(this.#array.array));
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        {
          array: this.#array.array,
          name: this.name,
          string: this.string,
          default: this.isDefault,
          modifier: this.modifier,
        },
      ],
    };
  }

  get displayName() {
    return `${this.name}${this.modifier ? ` (${this.modifier})` : ''}`;
  }
}
