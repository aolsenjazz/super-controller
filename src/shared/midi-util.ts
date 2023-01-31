/* eslint-disable no-bitwise */
const NOTE_OFF = 0x80; // 128
const NOTE_ON = 0x90; // 144
const KEY_PRESSURE = 0xa0; // 160
const CONTROL_CHANGE = 0xb0; // 176
const PROGRAM_CHANGE = 0xc0; // 192
const CHANNEL_PRESSURE = 0xd0; // 208
const PITCH_BEND = 0xe0; // 224

export function statusStringToByte(string: StatusString) {
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

export function byteToStatusString(byte: StatusByte, individualOnOff = false) {
  switch (byte) {
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
    default:
      return 'unknown';
  }
}
