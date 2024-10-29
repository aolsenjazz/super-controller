export const NOTE_OFF = 0x80 as StatusByte; // 128
export const NOTE_ON = 0x90 as StatusByte; // 144
export const KEY_PRESSURE = 0xa0 as StatusByte; // 160
export const CONTROL_CHANGE = 0xb0 as StatusByte; // 176
export const PROGRAM_CHANGE = 0xc0 as StatusByte; // 192
export const CHANNEL_PRESSURE = 0xd0 as StatusByte; // 208
export const PITCH_BEND = 0xe0 as StatusByte; // 224
export const SYSEX = 0xf0 as StatusByte; // 224

/* Mappings from CC number to a human-readable string */
export const CC_BINDINGS = new Map<number, string>([
  [0, 'Bank Select'],
  [1, 'Mod Wheel'],
  [2, 'Breath Controller'],
  [3, 'available'],
  [4, 'Foot Controller'],
  [5, 'Portamento Time'],
  [6, 'MSB Data Entry'],
  [7, 'Channel Volume'],
  [8, 'Balance'],
  [9, 'available'],
  [10, 'Pan'],
  [11, 'Expression Controller'],
  [12, 'Effect Control 1'],
  [13, 'Effect Control 2'],
  [14, 'available'],
  [15, 'available'],
  [16, 'General 1'],
  [17, 'General 2'],
  [18, 'General 3'],
  [19, 'General 4'],
  [20, 'available'],
  [21, 'available'],
  [22, 'available'],
  [23, 'available'],
  [24, 'available'],
  [25, 'available'],
  [26, 'available'],
  [27, 'available'],
  [28, 'available'],
  [29, 'available'],
  [30, 'available'],
  [31, 'available'],
  [32, 'LSB Bank Select'],
  [33, 'LSB Mod Wheel'],
  [34, 'LSB Breath Controller'],
  [35, 'available'],
  [36, 'LSB Foot Controller'],
  [37, 'LSB Portamento Time'],
  [38, 'LSB Data Entry'],
  [39, 'LSB Channel Volume'],
  [40, 'LSB Balance'],
  [41, 'available'],
  [42, 'LSB Pan'],
  [43, 'LSB Expression Controller'],
  [44, 'LSB Effect Control 1'],
  [45, 'LSB Effect Control 2'],
  [46, 'available'],
  [47, 'available'],
  [48, 'LSB General 1'],
  [49, 'LSB General 2'],
  [50, 'LSB General 3'],
  [51, 'LSB General 4'],
  [52, 'available'],
  [53, 'available'],
  [54, 'available'],
  [55, 'available'],
  [56, 'available'],
  [57, 'available'],
  [58, 'available'],
  [59, 'available'],
  [60, 'available'],
  [61, 'available'],
  [62, 'available'],
  [63, 'available'],
  [64, 'Sustain'],
  [65, 'Portamento'],
  [66, 'Sostenuto'],
  [67, 'Soft Pedal'],
  [68, 'Legato'],
  [69, 'Hold 2'],
  [70, 'Sound Control 1'],
  [71, 'Sound Control 2'],
  [72, 'Sound Control 3'],
  [73, 'Sound Control 4'],
  [74, 'Sound Control 5'],
  [75, 'Sound Control 6'],
  [76, 'Sound Control 7'],
  [77, 'Sound Control 8'],
  [78, 'Sound Control 9'],
  [79, 'Sound Control 10'],
  [80, 'General 5'],
  [81, 'General 6'],
  [82, 'General 7'],
  [83, 'General 8'],
  [84, 'Poramento Control'],
  [85, 'available'],
  [86, 'available'],
  [87, 'available'],
  [88, 'available'],
  [89, 'available'],
  [90, 'available'],
  [91, 'Effect 1 Depth'],
  [92, 'Effect 2 Depth'],
  [93, 'Effect 3 Depth'],
  [94, 'Effect 4 Depth'],
  [95, 'Effect 5 Depth'],
  [96, 'Data Increment'],
  [97, 'Data Decrement'],
  [98, 'LSB NRPN'],
  [99, 'NRPN'],
  [100, 'LSB RPN'],
  [101, 'RPN'],
  [102, 'available'],
  [103, 'available'],
  [104, 'available'],
  [105, 'available'],
  [106, 'available'],
  [107, 'available'],
  [108, 'available'],
  [109, 'available'],
  [110, 'available'],
  [111, 'available'],
  [112, 'available'],
  [113, 'available'],
  [114, 'available'],
  [115, 'available'],
  [116, 'available'],
  [117, 'available'],
  [118, 'available'],
  [119, 'available'],
  [120, 'All Sound Off'],
  [121, 'Reset All Controllers'],
  [122, 'Local Control'],
  [123, 'All Notes Off'],
  [124, 'Omni Mode Off'],
  [125, 'Omni Mode On'],
  [126, 'Mono Mode'],
  [127, 'Poly Mode'],
]);

/* Mapping between MIDI values and human-readable strings */
export const NOTE_BINDINGS = new Map([
  [0, 'C-1'],
  [1, 'C#-1'],
  [2, 'D-1'],
  [3, 'D#-1'],
  [4, 'E-1'],
  [5, 'F-1'],
  [6, 'F#-1'],
  [7, 'G-1'],
  [8, 'G#-1'],
  [9, 'A-1'],
  [10, 'A#-1'],
  [11, 'B-1'],
  [12, 'C0'],
  [13, 'C#0'],
  [14, 'D0'],
  [15, 'D#0'],
  [16, 'E0'],
  [17, 'F0'],
  [18, 'F#0'],
  [19, 'G0'],
  [20, 'G#0'],
  [21, 'A0'],
  [22, 'A#0'],
  [23, 'B0'],
  [24, 'C1'],
  [25, 'C#1'],
  [26, 'D1'],
  [27, 'D#1'],
  [28, 'E1'],
  [29, 'F1'],
  [30, 'F#1'],
  [31, 'G1'],
  [32, 'G#1'],
  [33, 'A1'],
  [34, 'A#1'],
  [35, 'B1'],
  [36, 'C2'],
  [37, 'C#2'],
  [38, 'D2'],
  [39, 'D#2'],
  [40, 'E2'],
  [41, 'F2'],
  [42, 'F#2'],
  [43, 'G2'],
  [44, 'G#2'],
  [45, 'A2'],
  [46, 'A#2'],
  [47, 'B2'],
  [48, 'C3'],
  [49, 'C#3'],
  [50, 'D3'],
  [51, 'D#3'],
  [52, 'E3'],
  [53, 'F3'],
  [54, 'F#3'],
  [55, 'G3'],
  [56, 'G#3'],
  [57, 'A3'],
  [58, 'A#3'],
  [59, 'B3'],
  [60, 'Middle C'],
  [61, 'C#4'],
  [62, 'D4'],
  [63, 'D#4'],
  [64, 'E4'],
  [65, 'F4'],
  [66, 'F#4'],
  [67, 'G4'],
  [68, 'G#4'],
  [69, 'A4'],
  [70, 'A#4'],
  [71, 'B4'],
  [72, 'C5'],
  [73, 'C#5'],
  [74, 'D5'],
  [75, 'D#5'],
  [76, 'E5'],
  [77, 'F5'],
  [78, 'F#5'],
  [79, 'G5'],
  [80, 'G#5'],
  [81, 'A5'],
  [82, 'A#5'],
  [83, 'B5'],
  [84, 'C6'],
  [85, 'C#6'],
  [86, 'D6'],
  [87, 'D#6'],
  [88, 'E6'],
  [89, 'F6'],
  [90, 'F#6'],
  [91, 'G6'],
  [92, 'G#6'],
  [93, 'A6'],
  [94, 'A#6'],
  [95, 'B6'],
  [96, 'C7'],
  [97, 'C#7'],
  [98, 'D7'],
  [99, 'D#7'],
  [100, 'E7'],
  [101, 'F7'],
  [102, 'F#7'],
  [103, 'G7'],
  [104, 'G#7'],
  [105, 'A7'],
  [106, 'A#7'],
  [107, 'B7'],
  [108, 'C8'],
  [109, 'C#8'],
  [110, 'D8'],
  [111, 'D#8'],
  [112, 'E8'],
  [113, 'F8'],
  [114, 'F#8'],
  [115, 'G8'],
  [116, 'G#8'],
  [117, 'A8'],
  [118, 'A#8'],
  [119, 'B8'],
  [120, 'C9'],
  [121, 'C#9'],
  [122, 'D9'],
  [123, 'D#9'],
  [124, 'E9'],
  [125, 'F9'],
  [126, 'G9'],
  [127, 'G#9'],
]);

export function byteToStatusString(
  byte: StatusNumber,
  individualOnOff = false,
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
