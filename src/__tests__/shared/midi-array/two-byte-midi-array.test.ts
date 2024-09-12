import { TwoByteMidiArray as TB } from '@shared/midi-array';

describe('create', () => {
  test('correctly sets values', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);

    expect(mm.statusString).toBe(status);
    expect(mm.channel).toBe(channel);
    expect(mm.number).toBe(number);
  });
});

describe('id', () => {
  test('returns correct value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);

    const expected = 'programchange.2.3';
    expect(mm.asString()).toBe(expected);
  });
});

describe('statusString', () => {
  test('returns correct value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);

    expect(mm.statusString).toBe('programchange');
  });
});

describe('status', () => {
  test('returns correct value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);

    expect(mm.status).toBe(0xc0);
  });
});

describe('channel', () => {
  test('returns correct value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.channel).toBe(channel);
  });
});

describe('number', () => {
  test('returns correct value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.number).toBe(number);
  });
});

describe('array', () => {
  test('returns correct value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    const expected = [0xc0 + 2, 3];
    expect(mm.array).toEqual(expected);
  });
});

describe('isNoteOff', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isNoteOff).toBe(false);
  });
});

describe('isNoteOn', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isNoteOn).toBe(false);
  });
});

describe('isControlChange', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isControlChange).toBe(false);
  });
});

describe('isCC', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isCC).toBe(false);
  });
});

describe('isKeyPressure', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isKeyPressure).toBe(false);
  });
});

describe('isProgramChange', () => {
  test('returns false', () => {
    const status = 'channelpressure';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isProgramChange).toBe(false);
  });

  test('returns true', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isProgramChange).toBe(true);
  });
});

describe('isChannelPressure', () => {
  test('returns true', () => {
    const status = 'channelpressure';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isChannelPressure).toBe(true);
  });

  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isChannelPressure).toBe(false);
  });
});

describe('isPitchbend', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isPitchBend).toBe(false);
  });
});

describe('isSustain', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isSustain).toBe(false);
  });
});

describe('isSysex', () => {
  test('returns false', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isSysex).toBe(false);
  });
});

describe('isOnIsh', () => {
  test('returns default value', () => {
    const status = 'programchange';
    const channel = 2;
    const number = 3;
    const mm = TB.create(status, channel, number);
    expect(mm.isOnIsh(true)).toBe(true);
  });
});
