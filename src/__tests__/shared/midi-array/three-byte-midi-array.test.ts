import { stringify, parse } from '@shared/util';
import { ThreeByteMidiArray as TB } from '@shared/midi-array';

describe('create', () => {
  test('correctly sets values', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);

    expect(mm.statusString).toBe(status);
    expect(mm.channel).toBe(channel);
    expect(mm.number).toBe(number);
    expect(mm.value).toBe(value);
  });
});

describe('id', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);

    const expected = 'noteoff.2.3';
    expect(mm.asString(false)).toBe(expected);
  });

  test('modifies status to noteon/notoeff', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);

    const expected = 'noteon/noteoff.2.3';
    expect(mm.asString(true)).toBe(expected);
  });
});

describe('statusString', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);

    expect(mm.statusString).toBe(status);
  });
});

describe('status', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);

    expect(mm.status).toBe(128);
  });
});

describe('channel', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.channel).toBe(channel);
  });
});

describe('number', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.number).toBe(number);
  });
});

describe('value', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.value).toBe(value);
  });
});

describe('array', () => {
  test('returns correct value', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    const expected = [130, 3, 4];
    expect(mm.array).toEqual(expected);
  });
});

describe('isNoteOff', () => {
  test('returns true', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isNoteOff).toBe(true);
  });

  test('returns false', () => {
    const status = 'noteon';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isNoteOff).toBe(false);
  });
});

describe('isNoteOn', () => {
  test('returns true', () => {
    const status = 'noteon';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isNoteOn).toBe(true);
  });

  test('returns false', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isNoteOn).toBe(false);
  });
});

describe('isControlChange', () => {
  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isControlChange).toBe(false);
  });

  test('returns true', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isControlChange).toBe(true);
  });
});

describe('isCC', () => {
  test('returns true', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isCC).toBe(true);
  });

  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isCC).toBe(false);
  });
});

describe('isKeyPressure', () => {
  test('returns true', () => {
    const status = 'keypressure';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isKeyPressure).toBe(true);
  });

  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isKeyPressure).toBe(false);
  });
});

describe('isProgramChange', () => {
  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isProgramChange).toBe(false);
  });
});

describe('isChannelPressure', () => {
  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isChannelPressure).toBe(false);
  });
});

describe('isPitchbend', () => {
  test('returns true', () => {
    const status = 'pitchbend';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isPitchBend).toBe(true);
  });

  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isPitchBend).toBe(false);
  });
});

describe('isSustain', () => {
  test('returns true', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 64;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isSustain).toBe(true);
  });

  test('returns false', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isSustain).toBe(false);
  });
});

describe('isSysex', () => {
  test('returns false', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isSysex).toBe(false);
  });
});

describe('isOnIsh', () => {
  test('returns default value for pitchbend', () => {
    const status = 'pitchbend';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isOnIsh(true)).toBe(true);
  });

  test('returns true for noteon, value > 0', () => {
    const status = 'noteon';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isOnIsh(false)).toBe(true);
  });
  test('returns false for noteon, value === 0', () => {
    const status = 'noteon';
    const channel = 2;
    const number = 3;
    const value = 0;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isOnIsh(true)).toBe(false);
  });
  test('returns false for noteoff, value > 0', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isOnIsh(true)).toBe(false);
  });
  test('returns true for controlchange, value > 0', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 4;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isOnIsh(false)).toBe(true);
  });
  test('returns true for controlchange, value === 0', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 0;
    const mm = TB.create(status, channel, number, value);
    expect(mm.isOnIsh(true)).toBe(false);
  });
});

describe('toJSON', () => {
  test('de/serializing retores values correctly', () => {
    const status = 'controlchange';
    const channel = 2;
    const number = 3;
    const value = 30;
    const mm = TB.create(status, channel, number, value);
    const json = stringify(mm);
    const parsed = parse<TB>(json);
    expect(parsed.array).toEqual(mm.array);
  });
});
