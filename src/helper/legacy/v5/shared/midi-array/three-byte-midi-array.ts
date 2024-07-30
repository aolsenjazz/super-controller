/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { MidiArray } from './midi-array';
import { statusStringToByte, byteToStatusString } from '../midi-util';

const NOTE_OFF = 0x80; // 128
const NOTE_ON = 0x90; // 144
const KEY_PRESSURE = 0xa0; // 160
const CONTROL_CHANGE = 0xb0; // 176
const PITCH_BEND = 0xe0; // 224

export type ThreeByteStatus = 0x80 | 0x90 | 0xa0 | 0xb0 | 0xe0;
export type ThreeByteString =
  | 'noteon'
  | 'noteoff'
  | 'keypressure'
  | 'controlchange'
  | 'pitchbend';

interface ThreeByteNumberArrayWithStatus extends NumberArrayWithStatus {
  length: 3;
}

@Revivable.register
export class ThreeByteMidiArray extends MidiArray {
  length = 3;

  0: StatusNumber;

  1: MidiNumber;

  2: MidiNumber;

  static create(
    status: ThreeByteStatus | ThreeByteString,
    channel: Channel,
    number: MidiNumber,
    value: MidiNumber
  ) {
    const numStatus =
      typeof status === 'string' ? statusStringToByte(status) : status;
    const index0 = (numStatus + channel) as StatusNumber;

    return new ThreeByteMidiArray([index0, number, value]);
  }

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(items: ThreeByteNumberArrayWithStatus) {
    super(items);
  }

  asString(mergeNoteEvents: boolean) {
    const status =
      (this.isNoteOn || this.isNoteOff) && mergeNoteEvents
        ? 'noteon/noteoff'
        : this.statusString;

    const stub = `${status}.${this.channel}`;
    return this.statusString === 'pitchbend' ? stub : `${stub}.${this.number}`;
  }

  get statusString() {
    return byteToStatusString(this.status, true) as ThreeByteString;
  }

  get status() {
    return (0xf0 & this[0]) as ThreeByteStatus;
  }

  get channel() {
    return (0x0f & this[0]) as Channel;
  }

  get number() {
    return this[1];
  }

  get value() {
    return this[2];
  }

  get array(): NumberArrayWithStatus {
    return [...this];
  }

  get isNoteOff() {
    return this.status === NOTE_OFF;
  }

  get isNoteOn() {
    return this.status === NOTE_ON;
  }

  get isControlChange() {
    return this.status === CONTROL_CHANGE;
  }

  get isCC() {
    return this.isControlChange;
  }

  get isKeyPressure() {
    return this.status === KEY_PRESSURE;
  }

  get isProgramChange() {
    return false;
  }

  get isChannelPressure() {
    return false;
  }

  get isPitchBend() {
    return this.status === PITCH_BEND;
  }

  get isSustain() {
    return this.isCC && this.number === 64;
  }

  get isSysex() {
    return false;
  }

  isOnIsh(def: boolean) {
    switch (this.status) {
      case NOTE_ON:
        return this.value > 0;
      case NOTE_OFF:
        return false;
      case CONTROL_CHANGE:
        return this.value > 0;
      default:
        return def;
    }
  }
}
