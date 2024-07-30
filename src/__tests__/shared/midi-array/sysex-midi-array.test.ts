import { stringify, parse } from '@shared/util';
import { SysexMidiArray } from '@shared/midi-array';

describe('constructor + array getter', () => {
  test('correctly sets values', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);

    expect(mm.array).toEqual(arr);
  });
});

describe('id', () => {
  test('returns correct value', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);

    const expected = 'sysex.1.2.3.4.5.247';
    expect(mm.asString()).toBe(expected);
  });
});

describe('statusString', () => {
  test('returns correct value', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);

    expect(mm.statusString).toBe('sysex');
  });
});

describe('status', () => {
  test('returns correct value', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);

    expect(mm.status).toBe(0xf0);
  });
});

describe('isNoteOff', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isNoteOff).toBe(false);
  });
});

describe('isNoteOn', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isNoteOn).toBe(false);
  });
});

describe('isControlChange', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isControlChange).toBe(false);
  });
});

describe('isCC', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isCC).toBe(false);
  });
});

describe('isKeyPressure', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isKeyPressure).toBe(false);
  });
});

describe('isProgramChange', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isProgramChange).toBe(false);
  });
});

describe('isChannelPressure', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isChannelPressure).toBe(false);
  });
});

describe('isPitchbend', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isPitchBend).toBe(false);
  });
});

describe('isSustain', () => {
  test('returns false', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isSustain).toBe(false);
  });
});

describe('isSysex', () => {
  test('returns true', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isSysex).toBe(true);
  });
});

describe('isOnIsh', () => {
  test('returns default value', () => {
    const arr: NumberArrayWithStatus = [240, 1, 2, 3, 4, 5, 247];
    const mm = new SysexMidiArray(arr);
    expect(mm.isOnIsh(true)).toBe(true);
  });
});

describe('toJSON', () => {
  test('de/serializing retores values correctly', () => {
    const arr: NumberArrayWithStatus = [240, 5, 6, 7, 8, 247];
    const mm = new SysexMidiArray(arr);
    const json = stringify(mm);
    const parsed = parse<SysexMidiArray>(json);
    expect(parsed.array).toEqual(arr);
  });
});
