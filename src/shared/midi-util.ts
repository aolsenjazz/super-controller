export const NOTE_OFF = 0x80; // 128
export const NOTE_ON = 0x90; // 144
export const KEY_PRESSURE = 0xa0; // 160
export const CONTROL_CHANGE = 0xb0; // 176
export const PROGRAM_CHANGE = 0xc0; // 192
export const CHANNEL_PRESSURE = 0xd0; // 208
export const PITCH_BEND = 0xe0; // 224
export const SYSEX = 0xf0; // 224

export function isOnIsh(arr: NumberArrayWithStatus, def: boolean) {
  if (arr.length === 3) {
    const status = arr[0] & 0xf0;
    const value = arr[2];

    switch (status) {
      case NOTE_ON:
      case CONTROL_CHANGE:
        return value > 0;
      case NOTE_OFF:
        return false;
      default:
        return def;
    }
  } else {
    return def;
  }
}

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

export function idForMsg(arr: NumberArrayWithStatus, individualOnOff = true) {
  const statusNibble = (arr[0] & 0xf0) as StatusByte;
  const ss = byteToStatusString(statusNibble, individualOnOff);

  if (arr.length === 3) {
    const stub = `${ss}.${arr[0] & 0x0f}`;
    return ss === 'pitchbend' ? stub : `${stub}.${arr[1]}`;
  }

  if (arr.length === 2) {
    return `${ss}.${arr[0] & 0x0f}.${arr[1]}`;
  }

  // otherwise sysex
  let id = 'sysex';
  arr
    .filter((_v, i) => i !== 0)
    .forEach((v) => {
      id += `.${v}`;
    });
  return id;
}
