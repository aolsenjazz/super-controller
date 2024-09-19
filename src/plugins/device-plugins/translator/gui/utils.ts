import { byteToStatusString } from '@shared/midi-util';

import { MidiEvent } from './midi-event';

export function readableTime() {
  const timestamp = Date.now();
  const date = new Date(timestamp);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

export function getStatusString(msg: NumberArrayWithStatus) {
  const byte = (msg[0] & 0xf0) as StatusByte;
  return byteToStatusString(byte, true);
}

export function rowId(e: MidiEvent) {
  return `${e.time}:${e.deviceId}`;
}

export const statusByteMap: { [key: number]: string } = {
  0x80: 'Note Off',
  0x90: 'Note On',
  0xb0: 'Control Change',
  0xc0: 'Program Change',
};

export const statusStringToByte: { [key: string]: number } = {
  'Note Off': 0x80,
  'Note On': 0x90,
  'Control Change': 0xb0,
  'Program Change': 0xc0,
};

export const statusStrings = Object.keys(statusStringToByte);

export function parseStatusByte(statusByte: number) {
  const status = statusByte & 0xf0;
  const channel = statusByte & 0x0f;
  return { status, channel };
}

export function buildStatusByte(status: number, channel: number) {
  return ((status & 0xf0) | (channel & 0x0f)) as StatusNumber;
}
