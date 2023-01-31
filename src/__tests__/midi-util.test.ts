/* eslint-disable no-bitwise */

import { MidiArray } from '@shared/midi-array';

describe('MidiArray.create', () => {
  test('works using status string', () => {
    const status = 'noteoff';
    const channel = 2;
    const number = 3;
    const value = 3;

    const mm = MidiArray.create(status, channel, number, value);

    expect(mm[0] & 0xf0).toEqual(128);
    expect(mm[0] & 0x0f).toEqual(channel);
    expect(mm[1]).toEqual(number);
    expect(mm[2]).toEqual(value);
  });

  test('works using status number', () => {
    const status = 128;
    const channel = 2;
    const number = 3;
    const value = 3;

    const mm = MidiArray.create(status, channel, number, value);

    expect(mm[0] & 0xf0).toEqual(128);
    expect(mm[0] & 0x0f).toEqual(channel);
    expect(mm[1]).toEqual(number);
    expect(mm[2]).toEqual(value);
  });
});
