import { MidiArray } from './midi-array';
import {
  TwoByteMidiArray,
  TwoByteStatus,
  TwoByteString,
} from './two-byte-midi-array';
import {
  ThreeByteMidiArray,
  ThreeByteStatus,
  ThreeByteString,
} from './three-byte-midi-array';
import { SysexMidiArray } from './sysex-midi-array';

type TwoBStatuses = TwoByteString | TwoByteStatus;
type ThreeBStatuses = ThreeByteString | ThreeByteStatus;

export function create<Type extends MidiArray = MidiArray>(
  arrOrStatus: NumberArrayWithStatus | StatusByte | StatusString,
  channel?: Channel,
  number?: MidiNumber,
  value?: MidiNumber
): Type {
  if (Array.isArray(arrOrStatus)) {
    const s = (arrOrStatus[0] & 0xf0) as StatusByte;

    // sysex need to be handled differently
    if (s === 0xf0) return new SysexMidiArray(arrOrStatus) as unknown as Type;

    const c = (arrOrStatus[0] & 0x0f) as Channel;
    const n = arrOrStatus[1] as MidiNumber;
    const v =
      arrOrStatus.length > 2 ? (arrOrStatus[2] as MidiNumber) : undefined;

    return create<Type>(s, c, n, v);
  }

  if (channel === undefined) throw new Error(`Channel may not be undefined!`);
  if (number === undefined) throw new Error(`Number may not be undefined!`);

  return ['programchange', 'channelpressure', 0xc0, 0xd0].includes(arrOrStatus)
    ? (TwoByteMidiArray.create(
        arrOrStatus as TwoBStatuses,
        channel,
        number
      ) as unknown as Type)
    : (ThreeByteMidiArray.create(
        arrOrStatus as ThreeBStatuses,
        channel,
        number,
        value || 0
      ) as unknown as Type);
}

export { TwoByteMidiArray, ThreeByteMidiArray, SysexMidiArray, MidiArray };
