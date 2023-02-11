/* eslint-disable no-bitwise */

import { MidiArray } from '@shared/midi-array';

test('constructor sets values correct', () => {
  const arr: [StatusNumber, MidiNumber, MidiNumber] = [129, 1, 1]; // note off & channel=1 & number=1 & value=1
  const ma = new MidiArray(arr);

  expect(ma.status).toEqual(arr[0] & 0xf0);
  expect(ma.channel).toEqual(arr[0] & 0x0f);
  expect(ma.number).toEqual(arr[1]);
  expect(ma.value).toEqual(arr[2]);
});

test('isSustain returns true for sustain', () => {
  const mm = MidiArray.create('controlchange', 0, 64, 0);
  expect(mm.isSustain).toBe(true);
});

test('isSustain returns false for non-cc', () => {
  const mm = MidiArray.create('noteon', 0, 64, 0);
  expect(mm.isSustain).toBe(false);
});

test('isOnIsh returns default true for programchange', () => {
  const number = 127;
  const value = 127;
  const channel = 0;
  const eventType = 'programchange';
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.isOnIsh(true)).toBe(true);
});

test('isOnIsh returns default false for programchange', () => {
  const number = 127;
  const value = 127;
  const channel = 0;
  const eventType = 'programchange';
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.isOnIsh(false)).toBe(false);
});

test('isOnIsh returns false for noteoff', () => {
  const number = 127;
  const value = 127;
  const channel = 0;
  const eventType = 'noteoff';
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.isOnIsh(true)).toBe(false);
});

test('isOnIsh returns true for noteon', () => {
  const number = 127;
  const value = 127;
  const channel = 0;
  const eventType = 'noteon';
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.isOnIsh(false)).toBe(true);
});

test('isOnIsh returns true for cc value > 0', () => {
  const number = 127;
  const value = 1;
  const channel = 0;
  const eventType = 'controlchange';
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.isOnIsh(false)).toBe(true);
});

test('isOnIsh returns false for cc value === 0', () => {
  const number = 127;
  const value = 0;
  const channel = 0;
  const eventType = 'controlchange';
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.isOnIsh(true)).toBe(false);
});

test('get statusString returns noteon', () => {
  const number = 127;
  const value = 127;
  const channel = 0;
  const eventType = 144;
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.statusString).toEqual('noteon');
});

test('get statusString returns noteoff', () => {
  const number = 127;
  const value = 127;
  const channel = 0;
  const eventType = 128;
  const mm = MidiArray.create(eventType, channel, number, value);
  expect(mm.statusString).toEqual('noteoff');
});
