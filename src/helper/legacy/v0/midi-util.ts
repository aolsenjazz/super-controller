/* eslint-disable no-bitwise */
const NOTE_OFF = 0x80;
const NOTE_ON = 0x90;
const KEY_PRESSURE = 0xa0;
const CONTROL_CHANGE = 0xb0;
const PROGRAM_CHANGE = 0xc0;
const CHANNEL_PRESSURE = 0xd0;
const PITCH_BEND = 0xe0;

const STATUS_BYTE = 0xf0;
const CHANNEL_BYTE = 0x0f;

export type StatusString =
  | 'noteon'
  | 'noteoff'
  | 'keypressure'
  | 'controlchange'
  | 'programchange'
  | 'channelpressure'
  | 'pitchbend'
  | 'unknown';

export type Channel =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

class Status {
  number: number;

  constructor(number: number) {
    this.number = number;
  }

  get string() {
    switch (this.byte) {
      case NOTE_OFF:
        return 'noteoff';
      case NOTE_ON:
        return 'noteon';
      case KEY_PRESSURE:
        return 'keypressure';
      case CONTROL_CHANGE:
        return 'controlchange';
      case PROGRAM_CHANGE:
        return 'programchange';
      case CHANNEL_PRESSURE:
        return 'channelpressure';
      case PITCH_BEND:
        return 'pitchbend';
      default:
        return 'unknown';
    }
  }

  get byte() {
    return this.number & STATUS_BYTE;
  }
}

function statusStringToByte(string: StatusString) {
  switch (string) {
    case 'noteon':
      return NOTE_ON;
    case 'noteoff':
      return NOTE_OFF;
    case 'keypressure':
      return KEY_PRESSURE;
    case 'controlchange':
      return CONTROL_CHANGE;
    case 'programchange':
      return PROGRAM_CHANGE;
    case 'pitchbend':
      return PITCH_BEND;
    default:
      return 0x00;
  }
}

export function getChannel(msg: number[]) {
  return (msg[0] & CHANNEL_BYTE) as Channel;
}

export function getStatus(msg: number[]) {
  return new Status(msg[0]);
}

export function setChannel(msg: number[], channel: number) {
  const newMsg = [...msg];
  const status = getStatus(msg).byte;
  const int = status | channel;
  newMsg[0] = int;
  return newMsg;
}

export function setStatus(msg: number[], status: StatusString) {
  const newMsg = [...msg];
  const byte = statusStringToByte(status);
  const channel = getChannel(msg);
  newMsg[0] = byte | channel;
  return newMsg;
}
