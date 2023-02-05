/* eslint-disable no-new */

import { MidiArray } from '@shared/midi-array';
import { ConstantPropagator } from '@shared/propagators';

describe('getResponse', () => {
  const on = MidiArray.create('noteon', 0, 0, 127);
  const off = MidiArray.create('noteoff', 0, 0, 127);

  test('state is flipped when or=toggle', () => {
    const or = 'toggle';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const c = new ConstantPropagator(or, et, number, channel, value);

    c.getResponse(on);
    expect(c.state).toBe('on');
    c.getResponse(off);
    expect(c.state).toBe('off');
  });

  test('state is not flipped when or=constant', () => {
    const or = 'constant';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const c = new ConstantPropagator(or, et, number, channel, value);

    c.getResponse(on);
    expect(c.state).toBe('off');
  });
});
