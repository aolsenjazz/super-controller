/* eslint-disable no-new */

import { GatePropagator } from '@shared/propagators';

const noteon = [144, 32, 127] as NumberArrayWithStatus; // Manually building the MIDI array for Note On
const noteoff = [128, 32, 0] as NumberArrayWithStatus; // Manually building the MIDI array for Note Off

class Wrapper extends GatePropagator {
  getResponse(msg: NumberArrayWithStatus) {
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

    const r1 = w.getResponse(noteon) as NumberArrayWithStatus;

    expect(r1[1]).toBe(number); // Changed r1.number to r1[1] (since it's now a MIDI array)
    expect(r1[0] & 0x0f).toBe(channel); // Checking channel in the status byte
    expect(r1[2]).toBe(127); // Value
    expect(w.statusString).toBe(et); // Assuming getStatusString() is available to get status string from the array

    const r2 = w.getResponse(noteoff) as NumberArrayWithStatus;

    expect(r2[1]).toBe(number);
    expect(r2[0] & 0x0f).toBe(channel);
    expect(r2[2]).toBe(0);
    expect(w.statusString).toBe(et);
  });

  test('handleAsToggle flow works correctly', () => {
    const or = 'toggle';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(or, et, number, channel, value);

    const r1 = w.getResponse(noteon) as NumberArrayWithStatus;

    expect(r1[1]).toBe(number);
    expect(r1[0] & 0x0f).toBe(channel);
    expect(r1[2]).toBe(127);
    expect(w.statusString).toBe(et);

    const r2 = w.getResponse(noteoff) as NumberArrayWithStatus;

    expect(r2[1]).toBe(number);
    expect(r2[0] & 0x0f).toBe(channel);
    expect(r2[2]).toBe(0);
    expect(w.statusString).toBe(et);
  });

  test('handleAsConstant flow works correctly', () => {
    const or = 'constant';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(or, et, number, channel, value);

    const r1 = w.getResponse(noteon) as NumberArrayWithStatus;

    expect(r1[1]).toBe(number);
    expect(r1[0] & 0x0f).toBe(channel);
    expect(r1[2]).toBe(100); // For constant, value should stay the same
    expect(w.statusString).toBe(et);

    const r2 = w.getResponse(noteoff) as NumberArrayWithStatus;

    expect(r2[1]).toBe(number);
    expect(r2[0] & 0x0f).toBe(channel);
    expect(r2[2]).toBe(100); // Still constant
    expect(w.statusString).toBe(et);
  });
});
