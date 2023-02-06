/* eslint-disable prefer-destructuring */
/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { byteToStatusString } from '../midi-util';
import { DefaultPreservedMidiArray } from '../default-preserved-midi-array';

import { Color } from '../driver-types/color';

@Revivable.register
export class ColorImpl extends DefaultPreservedMidiArray {
  readonly name: string;

  readonly string: string;

  readonly isDefault: boolean;

  readonly modifier?: 'blink' | 'pulse';

  static fromDrivers(
    c: Color,
    parentNumber: MidiNumber | undefined,
    parentChannel: Channel | undefined
  ) {
    const { eventType, value } = c;
    const number = c.number || parentNumber;
    const channel = c.channel || parentChannel;

    const arr = MidiArray.create(eventType, channel!, number!, value);

    return new ColorImpl(
      arr.array,
      arr.array,
      c.name,
      c.string,
      c.default,
      c.modifier
    );
  }

  constructor(
    defaults: MidiTuple,
    arr: MidiTuple,
    name: string,
    string: string,
    isDefault = false,
    modifier?: 'blink' | 'pulse'
  ) {
    super(defaults);

    this.status = (arr[0] & 0xf0) as StatusByte;
    this.channel = (arr[0] & 0x0f) as Channel;
    this.number = arr[1];
    this.value = arr[2];

    this.name = name;
    this.string = string;
    this.isDefault = isDefault;
    this.modifier = modifier;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.default,
        this.array,
        this.name,
        this.string,
        this.isDefault,
        this.modifier,
      ],
    };
  }

  get displayName() {
    return `${this.name}${this.modifier ? ` (${this.modifier})` : ''}`;
  }

  get eventType() {
    return byteToStatusString(this.status, true) as StatusString;
  }
}
