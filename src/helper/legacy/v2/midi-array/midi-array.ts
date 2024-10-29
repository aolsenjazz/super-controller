/* eslint-disable no-bitwise */
import { byteToStatusString } from '../midi-util';

export abstract class MidiArray extends Array<number> {
  readonly [n: number]: number;

  0: StatusNumber;

  constructor(items: NumberArrayWithStatus) {
    super(...items);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): { name: string; args: any[] } {
    return { name: this.constructor.name, args: [this.array] };
  }

  get statusString() {
    return byteToStatusString(this.status, true);
  }

  get array() {
    return [...this];
  }

  abstract id(mergeNoteEvents: boolean): string;

  abstract get status(): StatusByte;

  abstract get isNoteOff(): boolean;

  abstract get isNoteOn(): boolean;

  abstract get isControlChange(): boolean;

  abstract get isCC(): boolean;

  abstract get isKeyPressure(): boolean;

  abstract get isProgramChange(): boolean;

  abstract get isChannelPressure(): boolean;

  abstract get isPitchBend(): boolean;

  abstract get isSustain(): boolean;

  abstract get isSysex(): boolean;

  abstract isOnIsh(def: boolean): boolean;
}
