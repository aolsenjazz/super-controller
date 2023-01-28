/* eslint @typescript-eslint/no-explicit-any: 0 */

import { getStatus, getChannel } from './midi-util';

export function getDiff(l1: string[], l2: string[]) {
  const ex1 = l1.filter((str) => !l2.includes(str));
  const ex2 = l2.filter((str) => !l1.includes(str));
  return [ex1, ex2];
}

/**
 * Convenience function to wrap another function in a throttle. Destroys throttled function calls
 */
export function applyDestructiveThrottle(
  func: (...args: any[]) => void,
  delay: number
) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (!timeout) {
      timeout = setTimeout(() => {
        func(...args);
        timeout = null;
      }, delay);
    }
  };
}

/**
 * Convenience function to wrap another function in a throttle. Queues throttled function to
 * be executed at a later time
 */
export function applyNondestructiveThrottle(
  func: (...args: any[]) => void,
  executionIncrementMs: number
) {
  let checkpoint = Date.now();

  return (...args: any[]) => {
    const delay = Math.max(checkpoint - Date.now(), 0);
    checkpoint = Date.now() + executionIncrementMs + delay;

    setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Return the input id for the given details. Used by both `InputConfig` and `VirtualInput`s
 *
 * @param msg The message to encode or the msg status string
 * @param number The message number if argument[0] is status string
 * @returns The ID of the input
 */
export function inputIdFor(
  msg: number[] | (StatusString | 'noteon/noteoff'),
  channel?: Channel,
  number?: number
) {
  let status;
  let num = number;
  let chan = channel;

  if (Array.isArray(msg)) {
    status = getStatus(msg).string;
    num = msg[1]; // eslint-disable-line
    chan = getChannel(msg);
  } else {
    if (num === undefined && msg !== 'pitchbend')
      throw new Error('number must not be undefined');
    if (channel === undefined) throw new Error('channel must not be undefined');
    status = msg;
  }

  status = ['noteon', 'noteoff'].includes(status) ? 'noteon/noteoff' : status;

  return status === 'pitchbend'
    ? `${status}.${chan}`
    : `${status}.${chan}.${num}`;
}

/**
 * Is this a sustain message?
 *
 * @param msg Maybe a sustain message
 * @returns true if msg is a sustain message
 */
export function isSustain(msg: number[]) {
  return getStatus(msg).string === 'controlchange' && msg[1] === 64;
}

/**
 * Generally speaking, is this message and 'on' message? If message doesn't have
 * a clear notion of on-ness (programchange), return `default`
 *
 * @param msg The message
 * @param def The value to return if message type has no notion of on-ness
 * @returns `true` if message is on-ish
 */
export function isOnMessage(msg: number[], def: boolean) {
  const status = getStatus(msg).string;

  switch (status) {
    case 'noteon':
      return msg[2] > 0;
    case 'noteoff':
      return false;
    case 'controlchange':
      return msg[2] > 0;
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

/* CC numbers which don't have a default interpretation */
export const UNMAPPED_CC: number[] = [
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
export function stringVal(midiInt: number) {
  const str = NOTE_BINDINGS.get(midiInt);

  if (str === undefined) throw new Error(`bad MIDI value [${midiInt}]`);

  return str;
}
