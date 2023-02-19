/* eslint-disable no-bitwise */
import { stringify, parse } from '@shared/util';
import { ColorConfigPropagator } from '@shared/propagators';
import { Color } from '@shared/driver-types';
import { ColorImpl } from '@shared/hardware-config';

class Wrapped extends ColorConfigPropagator {
  getResponse() {
    return super.getResponse();
  }
}

const GREEN: Color = {
  name: 'Green',
  string: 'green',
  array: [152, 5, 2],
};
const GREEN_IMPL = new ColorImpl(GREEN);

const RED: Color = {
  name: 'Red',
  string: 'red',
  array: [153, 5, 3],
};
const RED_IMPL = new ColorImpl(RED);

describe('toJSON', () => {
  test('de/serializes correctly', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(2, GREEN_IMPL);
    const fb = new Map();
    cb.set(2, 3);

    const propagator = new ColorConfigPropagator(hr, or, cb, fb);
    const json = stringify(propagator);
    const parsed = parse<ColorConfigPropagator>(json);
    expect(JSON.stringify(parsed)).toEqual(JSON.stringify(propagator));
  });
});

describe('setColor + getColor', () => {
  test('sets color and gets color', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map();

    const propagator = new ColorConfigPropagator(hr, or, cb, fb);
    propagator.setColor(2, GREEN_IMPL);

    expect(propagator.getColor(2)).toBe(GREEN_IMPL);
  });

  test('set color deletes fx config', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map();

    const propagator = new ColorConfigPropagator(hr, or, cb, fb);
    propagator.setColor(2, GREEN_IMPL);
    propagator.setFx(2, 4);
    propagator.setColor(2, RED_IMPL);
    expect(propagator.getFx(2)).toBe(9);
  });
});

describe('setFx + getFx', () => {
  test('sets fx and gets fx', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map();

    const propagator = new ColorConfigPropagator(hr, or, cb, fb);
    propagator.setFx(2, 5);

    expect(propagator.getFx(2)).toBe(5);
  });

  test('getFx return color channel when fx unset', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map();

    const propagator = new ColorConfigPropagator(hr, or, cb, fb);
    propagator.setColor(2, GREEN_IMPL);
    expect(propagator.getFx(2)).toEqual(GREEN_IMPL.array[0] & 0x0f);
  });
});

describe('getResponse', () => {
  test('doesnt apply override when none present', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(1, GREEN_IMPL);
    const fb = new Map();
    const propagator = new Wrapped(hr, or, cb, fb);

    const r = propagator.getResponse();
    expect(r).toEqual(GREEN_IMPL.array);
  });

  test('applies override when present', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(1, GREEN_IMPL);
    const fb = new Map();
    fb.set(1, 14);
    const propagator = new Wrapped(hr, or, cb, fb);

    const r = propagator.getResponse();
    expect(r![1]).toEqual(GREEN_IMPL.array[1]);
    expect(r![2]).toEqual(GREEN_IMPL.array[2]);
    expect(r![0] & 0xf0).toEqual(GREEN_IMPL.array[0] & 0xf0);
    expect(r![0] & 0x0f).toEqual(14);
  });
});
