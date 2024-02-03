/* eslint-disable no-bitwise */
import { MidiArray } from './midi-array';
import { statusStringToByte, byteToStatusString } from '../midi-util';

const PROGRAM_CHANGE = 0xc0; // 192
const CHANNEL_PRESSURE = 0xd0; // 208

export type TwoByteStatus = 0xc0 | 0xd0;
export type TwoByteString = 'programchange' | 'channelpressure';

interface TwoByteNumberArrayWithStatus extends NumberArrayWithStatus {
  length: 2;
}

export class TwoByteMidiArray extends MidiArray {
  length = 2;

  0: StatusNumber;

  1: MidiNumber;

  static create(
    status: TwoByteStatus | TwoByteString,
    channel: Channel,
    number: MidiNumber
  ) {
    const numStatus =
      typeof status === 'string' ? statusStringToByte(status) : status;
    const index0 = (numStatus + channel) as StatusNumber;

    return new TwoByteMidiArray([index0, number]);
  }

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(items: TwoByteNumberArrayWithStatus) {
    super(items);
  }

  asString() {
    return `${this.statusString}.${this.channel}.${this.number}`;
  }

  get statusString() {
    return byteToStatusString(this.status, true) as TwoByteString;
  }

  get status() {
    return (0xf0 & this[0]) as TwoByteStatus;
  }

  get channel() {
    return (0x0f & this[0]) as Channel;
  }

  get number() {
    return this[1];
  }

  get array(): NumberArrayWithStatus {
    return [...this];
  }

  get isNoteOff() {
    return false;
  }

  get isNoteOn() {
    return false;
  }

  get isControlChange() {
    return false;
  }

  get isCC() {
    return this.isControlChange;
  }

  get isKeyPressure() {
    return false;
  }

  get isProgramChange() {
    return this.status === PROGRAM_CHANGE;
  }

  get isChannelPressure() {
    return this.status === CHANNEL_PRESSURE;
  }

  get isPitchBend() {
    return false;
  }

  get isSustain() {
    return false;
  }

  get isSysex() {
    return false;
  }

  isOnIsh(def: boolean) {
    return def;
  }
}
