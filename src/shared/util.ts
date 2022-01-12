import {
  MidiValue,
  MidiMessage,
  Channel,
  EventType,
} from 'midi-message-parser';
import { Color } from './driver-types';

function inputIdForPitchbend(channel?: Channel) {
  if (channel === undefined) throw new Error('channel must not be undefined');
  return `pitchbend.${channel}`;
}

export function getDiff(l1: string[], l2: string[]) {
  const ex1 = l1.filter((str) => !l2.includes(str));
  const ex2 = l2.filter((str) => !l1.includes(str));
  return [ex1, ex2];
}

/**
 * Return the input id for the given details. Used by both `InputConfig` and `VirtualInput`s
 *
 * @param eventType EventType, MidiMessage, or midi array
 * @param channel The MIDI channel, or undefined if eventType === (MidiMessage | array)
 * @param number The midi number if exists or undefined if eventType === (MidiMessage | array)
 * @returns The ID of the input
 */
export function inputIdFor(
  eventType: EventType | MidiMessage | number[],
  channel?: Channel,
  number?: MidiValue
): string {
  let e: EventType | 'noteon/notoff';
  let c: Channel | undefined;
  let n: MidiValue | undefined;

  if (Array.isArray(eventType)) {
    const mm = new MidiMessage(eventType, 0);
    return inputIdFor(mm);
  }

  if (eventType instanceof MidiMessage) {
    n = eventType.number;
    c = eventType.channel;
    e = ['noteon', 'noteoff'].includes(eventType.type)
      ? 'noteon/noteoff'
      : eventType.type;
  } else {
    n = number;
    c = channel;
    e = ['noteon', 'noteoff'].includes(eventType)
      ? 'noteon/noteoff'
      : eventType;
  }

  if (e === 'pitchbend') return inputIdForPitchbend(c);

  if (c === undefined || n === undefined)
    throw new Error('channel and number must not be undefined');

  return `${e}.${c}.${n}`;
}

/**
 * Returns the message to be send to devices in order to trigger the given color.
 *
 * @param number The MIDI number
 * @param channel The MIDI channel
 * @param c The color to set
 * @returns A `MidiMessage` which can be used to trigger the color
 */
export function msgForColor(number: MidiValue, channel: Channel, c: Color) {
  return new MidiMessage(c.eventType, number, c.value, channel, 0);
}

/**
 * Is this a sustain message?
 *
 * @param msg Maybe a sustain message
 * @returns true if msg is a sustain message
 */
export function isSustain(msg: MidiValue[]) {
  const mm = new MidiMessage(msg, 0);
  return mm.number === 64 && mm.type === 'controlchange';
}

/**
 * Generally speaking, is this message and 'on' message? If message doesn't have
 * a clear notion of on-ness (programchange), return `default`
 *
 * @param msg The message
 * @param msg The value to return if message type has no notion of on-ness
 * @returns `true` if message is on-ish
 */
export function isOnMessage(msg: MidiMessage | number[], def: boolean) {
  let mm;
  if (msg instanceof MidiMessage) mm = msg;
  else mm = new MidiMessage(msg, 0);

  switch (mm.type) {
    case 'noteon':
      return true;
    case 'noteoff':
      return false;
    case 'controlchange':
      return mm.value > 0;
    default:
      return def;
  }
}

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
const NOTE_BINDINGS = new Map([
  [0, 'C-2'],
  [1, 'C#-2'],
  [2, 'D-2'],
  [3, 'D#-2'],
  [4, 'E-2'],
  [5, 'F-2'],
  [6, 'F#-2'],
  [7, 'G-2'],
  [8, 'G#-2'],
  [9, 'A-2'],
  [10, 'A#-2'],
  [11, 'B-2'],
  [12, 'C-1'],
  [13, 'C#-1'],
  [14, 'D-1'],
  [15, 'D#-1'],
  [16, 'E-1'],
  [17, 'F-1'],
  [18, 'F#-1'],
  [19, 'G-1'],
  [20, 'G#-1'],
  [21, 'A-1'],
  [22, 'A#-1'],
  [23, 'B-1'],
  [24, 'C0'],
  [25, 'C#0'],
  [26, 'D0'],
  [27, 'D#0'],
  [28, 'E0'],
  [29, 'F0'],
  [30, 'F#0'],
  [31, 'G0'],
  [32, 'G#0'],
  [33, 'A0'],
  [34, 'A#0'],
  [35, 'B0'],
  [36, 'C1'],
  [37, 'C#1'],
  [38, 'D1'],
  [39, 'D#1'],
  [40, 'E1'],
  [41, 'F1'],
  [42, 'F#1'],
  [43, 'G1'],
  [44, 'G#1'],
  [45, 'A1'],
  [46, 'A#1'],
  [47, 'B1'],
  [48, 'C2'],
  [49, 'C#2'],
  [50, 'D2'],
  [51, 'D#2'],
  [52, 'E2'],
  [53, 'F2'],
  [54, 'F#2'],
  [55, 'G2'],
  [56, 'G#2'],
  [57, 'A2'],
  [58, 'A#2'],
  [59, 'B2'],
  [60, 'Middle C'],
  [61, 'C#3'],
  [62, 'D3'],
  [63, 'D#3'],
  [64, 'E3'],
  [65, 'F3'],
  [66, 'F#3'],
  [67, 'G3'],
  [68, 'G#3'],
  [69, 'A3'],
  [70, 'A#3'],
  [71, 'B3'],
  [72, 'C'],
  [73, 'C#4'],
  [74, 'D4'],
  [75, 'D#4'],
  [76, 'E4'],
  [77, 'F4'],
  [78, 'F#4'],
  [79, 'G4'],
  [80, 'G#4'],
  [81, 'A4'],
  [82, 'A#4'],
  [83, 'B4'],
  [84, 'C5'],
  [85, 'C#5'],
  [86, 'D5'],
  [87, 'D#5'],
  [88, 'E5'],
  [89, 'F5'],
  [90, 'F#5'],
  [91, 'G5'],
  [92, 'G#5'],
  [93, 'A5'],
  [94, 'A#5'],
  [95, 'B5'],
  [96, 'C6'],
  [97, 'C#6'],
  [98, 'D6'],
  [99, 'D#6'],
  [100, 'E6'],
  [101, 'F6'],
  [102, 'F#6'],
  [103, 'G6'],
  [104, 'G#6'],
  [105, 'A6'],
  [106, 'A#6'],
  [107, 'B6'],
  [108, 'C7'],
  [109, 'C#7'],
  [110, 'D7'],
  [111, 'D#7'],
  [112, 'E7'],
  [113, 'F7'],
  [114, 'F#7'],
  [115, 'G7'],
  [116, 'G#7'],
  [117, 'A7'],
  [118, 'A#7'],
  [119, 'B7'],
  [120, 'C8'],
  [121, 'C#8'],
  [122, 'D8'],
  [123, 'D#8'],
  [124, 'E8'],
  [125, 'F8'],
  [126, 'G8'],
  [127, 'G#8'],
]);

/* CC numbers which don't have a default interpretation */
export const UNMAPPED_CC: MidiValue[] = [
  3, 9, 14, 15, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 35, 41, 46, 47,
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 85, 86, 87, 88, 89, 90, 102,
  103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117,
  118, 119,
];

/**
 * Returns a human-readable string value for the given MIDI value
 *
 * @param midiInt The MIDI number
 * @returns Human-readable note string
 */
export function stringVal(midiInt: MidiValue) {
  const str = NOTE_BINDINGS.get(midiInt);

  if (str === undefined) throw new Error(`bad MIDI value [${midiInt}]`);

  return str;
}
