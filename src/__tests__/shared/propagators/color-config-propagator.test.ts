/* eslint-disable no-bitwise */
import { ColorConfigPropagator } from '@shared/propagators';
import { Color, FxDriver } from '@shared/driver-types';

class Wrapped extends ColorConfigPropagator {
  getResponse() {
    return super.getResponse();
  }
}

const OFF: Color = {
  name: 'Green',
  string: 'green',
  array: [144, 0, 0],
  effectable: false,
  default: false,
};

const GREEN: Color = {
  name: 'Green',
  string: 'green',
  array: [144, 5, 2],
  effectable: true,
  default: true,
};

const RED: Color = {
  name: 'Red',
  string: 'red',
  array: [144, 5, 3],
  effectable: true,
};

const FX: FxDriver = {
  title: 'Solid',
  defaultVal: [1, 0, 0],
  effect: 'Brightness',
  validVals: [
    [1, 0, 0],
    [2, 0, 0],
  ],
  isDefault: true,
};

describe('getResponse', () => {
  test('increments state to 1, then 0', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(0, GREEN);
    cb.set(1, RED);
    const propagator = new Wrapped(hr, or, GREEN, FX, cb);

    propagator.getResponse();
    expect(propagator.currentStep).toBe(1);

    propagator.getResponse();
    expect(propagator.currentStep).toBe(0);
  });
});

describe('repeat', () => {
  test('uses default color when unset', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map<number, MidiNumber[]>();
    const propagator = new Wrapped(hr, or, RED, undefined, cb, fb);

    const r = propagator.getResponse();
    expect(r).toEqual(RED.array);
  });

  test('doesnt apply override when none present', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(1, GREEN);
    const fb = new Map<number, MidiNumber[]>();
    const propagator = new Wrapped(hr, or, undefined, undefined, cb, fb);

    const r = propagator.getResponse();
    expect(r).toEqual(GREEN.array);
  });

  test('applies default fx when present', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(1, GREEN);
    const fb = new Map<number, MidiNumber[]>();
    const propagator = new Wrapped(hr, or, undefined, FX, cb, fb);

    const r = propagator.getResponse();
    expect(r![0] & 0x0f).toEqual((GREEN.array[0] & 0x0f) + FX.defaultVal[0]);
  });

  test('applies override when present', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map<number, Color>();
    cb.set(1, GREEN);
    const fb = new Map<number, MidiNumber[]>();
    fb.set(1, [14, 0, 0]);
    const propagator = new Wrapped(hr, or, undefined, undefined, cb, fb);

    const r = propagator.getResponse();
    expect(r![1]).toEqual(GREEN.array[1]);
    expect(r![2]).toEqual(GREEN.array[2]);
    expect(r![0] & 0xf0).toEqual(GREEN.array[0] & 0xf0);
    expect(r![0] & 0x0f).toEqual(14);
  });
});

describe('restoreDefaults', () => {
  test('clears all fx + colors', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map<number, Color>();
    cb.set(1, GREEN);
    const fb = new Map<number, MidiNumber[]>();
    fb.set(1, [14, 0, 0]);
    const propagator = new Wrapped(hr, or, undefined, undefined, cb, fb);
    propagator.restoreDefaults();
    expect(propagator.getFxVal(1)).toBeUndefined();
    expect(propagator.getColor(1)).toBeUndefined();
  });
});

describe('getColor', () => {
  test('returns default when unset', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map<number, MidiNumber[]>();

    const propagator = new ColorConfigPropagator(
      hr,
      or,
      GREEN,
      undefined,
      cb,
      fb
    );
    propagator.setColor(2, GREEN);

    expect(propagator.getColor(2)).toBe(GREEN);
  });

  test('returns set color when set', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map<number, MidiNumber[]>();

    const propagator = new ColorConfigPropagator(
      hr,
      or,
      GREEN,
      undefined,
      cb,
      fb
    );
    propagator.setColor(2, RED);

    expect(propagator.getColor(2)).toBe(RED);
  });
});

describe('getFxVal', () => {
  test('returns default fxVal when unset if color is effectable', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map<number, MidiNumber[]>();

    const propagator = new ColorConfigPropagator(hr, or, GREEN, FX, cb, fb);

    expect(propagator.getFxVal(2)).toEqual(FX.defaultVal);
  });

  test('returns undefined if color isnt effectable', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    cb.set(0, OFF);
    const fb = new Map<number, MidiNumber[]>();

    const propagator = new ColorConfigPropagator(hr, or, OFF, FX, cb, fb);

    expect(propagator.getFxVal(0)).toBeUndefined();
  });

  test('returns set fxVal when set', () => {
    const hr = 'gate';
    const or = 'toggle';
    const cb = new Map();
    const fb = new Map<number, MidiNumber[]>();

    const propagator = new ColorConfigPropagator(hr, or, GREEN, FX, cb, fb);
    propagator.setFx(2, [5, 0, 0]);

    expect(propagator.getFxVal(2)).toEqual([5, 0, 0]);
  });
});
