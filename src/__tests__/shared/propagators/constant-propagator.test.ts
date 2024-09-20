/* eslint-disable no-new */

import { ConstantPropagator } from '@shared/propagators';

describe('getResponse', () => {
  const on = [144, 0, 127] as NumberArrayWithStatus;
  const off = [128, 0, 127] as NumberArrayWithStatus;

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
