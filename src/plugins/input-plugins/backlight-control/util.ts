export const NOTE_OFF = 0x80 as StatusByte; // 128
export const NOTE_ON = 0x90 as StatusByte; // 144
export const KEY_PRESSURE = 0xa0 as StatusByte; // 160
export const CONTROL_CHANGE = 0xb0 as StatusByte; // 176
export const PROGRAM_CHANGE = 0xc0 as StatusByte; // 192
export const CHANNEL_PRESSURE = 0xd0 as StatusByte; // 208
export const PITCH_BEND = 0xe0 as StatusByte; // 224
export const SYSEX = 0xf0 as StatusByte; // 224

export function statusStringToNibble(string: StatusString) {
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
    case 'sysex':
      return SYSEX;
    case 'channelpressure':
      return CHANNEL_PRESSURE;
    default:
      return SYSEX;
  }
}

/**
 * Sum two midi message arrays. Creates a new array and *does not* modify in-place
 */
export function sumMidiArrays(a1: number[], a2: number[]) {
  if (a1.length !== a2.length)
    throw new Error('cannot sum arrays with different lengths');

  const newArr = [...a1];
  for (let i = 0; i < newArr.length; i++) {
    newArr[i] += a2[i];
  }

  return newArr as NumberArrayWithStatus;
}

export function msgEquals(a1: number[], a2: number[]) {
  if (a1.length !== a2.length) return false;

  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) return false;
  }

  return true;
}

export function msgIdentityEquals(
  msg1: NumberArrayWithStatus,
  msg2: NumberArrayWithStatus,
  compareValueBytes = false,
) {
  if (msg1.length !== msg2.length) return false;

  const statusNibble1 = msg1[0] & 0xf0;
  const statusNibble2 = msg2[0] & 0xf0;

  const channel1 = msg1[0] & 0x0f;
  const channel2 = msg2[0] & 0x0f;

  if (statusNibble1 !== statusNibble2) return false;
  if (channel1 !== channel2) return false;

  switch (statusNibble1) {
    case NOTE_ON:
    case NOTE_OFF:
      if (msg1[1] !== msg2[1]) return false;
      if (compareValueBytes && msg1[2] !== msg2[2]) return false;
      return true;

    case CONTROL_CHANGE:
    case PROGRAM_CHANGE:
      if (msg1[1] !== msg2[1]) return false;
      return true;

    case SYSEX:
      return msgEquals(msg1, msg2);

    default:
      return msgEquals(msg1, msg2);
  }
}
