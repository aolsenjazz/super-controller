/* eslint-disable no-new */

import { MidiArray } from '@shared/midi-array';
import { GatePropagator } from '@shared/propagators';

const noteon = MidiArray.create('noteon', 0, 32, 127);
const noteoff = MidiArray.create('noteoff', 0, 32, 0);

class Wrapper extends GatePropagator {
  getResponse(msg: MidiArray) {
    return super.getResponse(msg);
  }
}

describe('getResponse', () => {
  test('handleAsGate flow works correctly', () => {
    const or = 'gate';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(or, et, number, channel, value);

    const r1 = w.getResponse(noteon);

    expect(r1.number).toBe(number);
    expect(r1.channel).toBe(channel);
    expect(r1.value).toBe(127);
    expect(r1.statusString).toBe(et);

    const r2 = w.getResponse(noteoff);

    expect(r2.number).toBe(number);
    expect(r2.channel).toBe(channel);
    expect(r2.value).toBe(0);
    expect(r2.statusString).toBe(et);
  });

  test('handleAsToggle flow works correctly', () => {
    const or = 'toggle';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(or, et, number, channel, value);

    const r1 = w.getResponse(noteon);

    expect(r1.number).toBe(number);
    expect(r1.channel).toBe(channel);
    expect(r1.value).toBe(127);
    expect(r1.statusString).toBe(et);

    const r2 = w.getResponse(noteoff);

    expect(r2.number).toBe(number);
    expect(r2.channel).toBe(channel);
    expect(r2.value).toBe(0);
    expect(r2.statusString).toBe(et);
  });

  test('handleAsConstant flow works correctly', () => {
    const or = 'constant';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(or, et, number, channel, value);

    const r1 = w.getResponse(noteon);

    expect(r1.number).toBe(number);
    expect(r1.channel).toBe(channel);
    expect(r1.value).toBe(100);
    expect(r1.statusString).toBe(et);
    const r2 = w.getResponse(noteoff);

    expect(r2.number).toBe(number);
    expect(r2.channel).toBe(channel);
    expect(r2.value).toBe(100);
    expect(r2.statusString).toBe(et);
  });
});
