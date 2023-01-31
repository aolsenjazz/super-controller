/* eslint-disable no-bitwise */
import { statusStringToByte, byteToStatusString } from './midi-util';

const NOTE_OFF = 0x80; // 128
const NOTE_ON = 0x90; // 144
const KEY_PRESSURE = 0xa0; // 160
const CONTROL_CHANGE = 0xb0; // 176
const PROGRAM_CHANGE = 0xc0; // 192
const CHANNEL_PRESSURE = 0xd0; // 208
const PITCH_BEND = 0xe0; // 224

export class MidiArray extends Array<number> {
  length: number = 3;

  0: StatusNumber;

  1: MidiNumber;

  2: MidiNumber;

  static create(
    status: StatusString | StatusByte,
    channel: Channel,
    number: MidiNumber,
    value: MidiNumber
  ): MidiArray {
    const numStatus =
      typeof status === 'string' ? statusStringToByte(status) : status;
    const index0 = (numStatus + channel) as StatusNumber;

    return new MidiArray([index0, number, value]);
  }

  constructor(items: MidiTuple) {
    super(...items);
  }

  get statusString() {
    return byteToStatusString(this.status);
  }

  get status() {
    return (0xf0 & this[0]) as StatusByte;
  }

  set status(byte: StatusByte) {
    this[0] = (byte | this.channel) as StatusNumber;
  }

  get channel() {
    return (0x0f & this[0]) as Channel;
  }

  set channel(byte: Channel) {
    this[0] = (this.status | byte) as StatusNumber;
  }

  get number() {
    return this[1];
  }

  set number(n: MidiNumber) {
    this[1] = n;
  }

  get value() {
    return this[2];
  }

  set value(v: MidiNumber) {
    this[2] = v;
  }

  get array(): MidiTuple {
    return [this[0], this[1], this[2]];
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
    return this.status === PROGRAM_CHANGE;
  }

  get isChannelPressure() {
    return this.status === CHANNEL_PRESSURE;
  }

  get isPitchBend() {
    return this.status === PITCH_BEND;
  }

  get isSustain() {
    return this.isCC && this.number === 64;
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
