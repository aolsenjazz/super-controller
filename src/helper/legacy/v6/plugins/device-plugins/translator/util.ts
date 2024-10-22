import type { TimestampedMidiEvent } from '../../types';

export const NOTE_OFF = 0x80 as StatusByte; // 128
export const NOTE_ON = 0x90 as StatusByte; // 144
export const KEY_PRESSURE = 0xa0 as StatusByte; // 160
export const CONTROL_CHANGE = 0xb0 as StatusByte; // 176
export const PROGRAM_CHANGE = 0xc0 as StatusByte; // 192
export const CHANNEL_PRESSURE = 0xd0 as StatusByte; // 208
export const PITCH_BEND = 0xe0 as StatusByte; // 224
export const SYSEX = 0xf0 as StatusByte; // 224

export function toString(msg: NumberArrayWithStatus) {
  return msg.reduce((a, b) => `${a}.${b}`, '').substring(1);
}

export function readableTime() {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

export function byteToStatusString(
  byte: StatusNumber,
  individualOnOff = false
) {
  const statusNibble = byte & 0xf0;
  switch (statusNibble) {
    case NOTE_OFF:
      if (individualOnOff) return 'noteoff';
      return 'noteon/noteoff';
    case NOTE_ON:
      if (individualOnOff) return 'noteon';
      return 'noteon/noteoff';
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
    case SYSEX:
      return 'sysex';
    default:
      return 'sysex';
  }
}

export function getStatusString(msg: NumberArrayWithStatus) {
  const byte = (msg[0] & 0xf0) as StatusByte;
  return byteToStatusString(byte, true);
}

export function rowId(e: TimestampedMidiEvent) {
  return `${e.time}:${e.msg}`;
}

export const statusByteMap: { [key: number]: string } = {
  0x80: 'Note Off',
  0x90: 'Note On',
  0xb0: 'Control Change',
  0xc0: 'Program Change',
};

export const statusBytes = Object.keys(statusByteMap).map(Number);

export const statusStringToNibble: { [key: string]: number } = {
  'Note Off': 0x80,
  'Note On': 0x90,
  'Control Change': 0xb0,
  'Program Change': 0xc0,
};

export const statusStrings = Object.keys(statusStringToNibble);

export function parseStatusByte(statusByte: number) {
  const status = statusByte & 0xf0;
  const channel = statusByte & 0x0f;
  return { status, channel };
}

export function buildStatusByte(status: number, channel: number) {
  return ((status & 0xf0) | (channel & 0x0f)) as StatusNumber;
}
