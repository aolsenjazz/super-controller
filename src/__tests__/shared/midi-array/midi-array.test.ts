/* eslint-disable no-bitwise */
import { stringify } from '@shared/util';
import { MidiArray as WrapMe } from '@shared/midi-array/midi-array';
import {
  create,
  SysexMidiArray,
  TwoByteMidiArray,
  ThreeByteMidiArray,
} from '@shared/midi-array';

class MidiArray extends WrapMe {
  asString() {
    return 'array';
  }

  get isCC() {
    return false;
  }

  get status() {
    return 128 as const;
  }

  get isSysex() {
    return false;
  }

  get isNoteOn() {
    return false;
  }

  get isNoteOff() {
    return false;
  }

  get isControlChange() {
    return false;
  }

  get isChannelPressure() {
    return false;
  }

  get isKeyPressure() {
    return false;
  }

  get isPitchBend() {
    return false;
  }

  get isSustain() {
    return false;
  }

  get isProgramChange() {
    return false;
  }

  isOnIsh(def: boolean) {
    return def;
  }
}

describe('array getter', () => {
  test('return array values in preserved order', () => {
    const arr: NumberArrayWithStatus = [128, 5, 6, 7, 8, 9];
    const mm = new MidiArray(arr);

    expect(mm.array).toEqual(arr);
  });
});

describe('statusString getter', () => {
  test('returns correct status string', () => {
    const arr: NumberArrayWithStatus = [128, 5, 6, 7, 8, 9];
    const mm = new MidiArray(arr);
    expect(mm.statusString).toBe('noteoff');
  });

  test('returns sysex for bad status byte even though i hate that', () => {
    const arr: NumberArrayWithStatus = [241, 5, 6, 7, 8, 9];
    const mm = new MidiArray(arr);

    expect(mm.statusString).toBe('noteoff');
  });
});

describe('toJSON', () => {
  test('de/serializing retores values correctly', () => {
    const arr: NumberArrayWithStatus = [128, 5, 6, 7, 8, 9];
    const mm = new MidiArray(arr);
    const json = stringify(mm);
    const parsed = JSON.parse(json); // can't use custom stringify/parse() because subclass isn't revivable
    expect(parsed.args[0]).toEqual(arr);
  });
});

describe('create', () => {
  test('sysex success', () => {
    const mm: NumberArrayWithStatus = [240, 1, 2, 3, 4, 247];
    const sysex = create<SysexMidiArray>(mm);
    expect(sysex.array).toEqual(mm);
  });

  test('twobyte where arg[0] === array success', () => {
    const mm: NumberArrayWithStatus = [194, 30];
    const pc = create<TwoByteMidiArray>(mm);
    expect(pc.array).toEqual(mm);
  });

  test('three where arg[0] === array success', () => {
    const mm: NumberArrayWithStatus = [194, 30];
    const pc = create<TwoByteMidiArray>(mm);
    expect(pc.array).toEqual(mm);
  });

  test('twobyte using longform args success', () => {
    const status = 192;
    const statusString = 'programchange';
    const channel = 2;
    const number = 30;
    const mm = create<TwoByteMidiArray>(status, channel, number);
    expect(mm.status).toBe(status);
    expect(mm.channel).toBe(channel);
    expect(mm.number).toBe(number);

    const mm2 = create<TwoByteMidiArray>(statusString, channel, number);
    expect(mm2.status).toBe(status);
    expect(mm2.channel).toBe(channel);
    expect(mm2.number).toBe(number);
  });

  test('threebyte using longform args success', () => {
    const status = 144;
    const statusString = 'noteon';
    const channel = 2;
    const number = 30;
    const value = 60;
    const mm = create<ThreeByteMidiArray>(status, channel, number, value);
    expect(mm.status).toBe(status);
    expect(mm.channel).toBe(channel);
    expect(mm.number).toBe(number);
    expect(mm.value).toBe(value);

    const mm2 = create<ThreeByteMidiArray>(
      statusString,
      channel,
      number,
      value
    );
    expect(mm2.status).toBe(status);
    expect(mm2.channel).toBe(channel);
    expect(mm2.number).toBe(number);
    expect(mm2.value).toBe(value);
  });

  test('longform without channel throws', () => {
    const status = 192;
    expect(() => {
      create<ThreeByteMidiArray>(status);
    }).toThrow();
  });

  test('longform without number throws', () => {
    const status = 192;
    const channel = 3;
    expect(() => {
      create<ThreeByteMidiArray>(status, channel);
    }).toThrow();
  });

  test('two-byte message is created status is programchange string', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 30;
    const mm = create(status, channel, number);
    expect(mm instanceof TwoByteMidiArray).toBe(true);
  });
});
