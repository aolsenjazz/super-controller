import { stringify, parse } from '@shared/util';
import { ThreeByteMidiArray } from '@shared/midi-array';
import { ContinuousPropagator as WrapMe } from '@shared/propagators';

const msg = ThreeByteMidiArray.create(176, 2, 34, 125);

class ContinuousPropagator extends WrapMe {
  getResponse(m: ThreeByteMidiArray) {
    return super.getResponse(m);
  }

  nextV(m: ThreeByteMidiArray) {
    return this.nextValue(m);
  }
}

describe('getResponse', () => {
  test('response value equal to msg.value for valueType = endless', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 127;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless',
      'endless'
    );

    const r = c.getResponse(msg) as ThreeByteMidiArray;
    expect(r.value).toBe(msg.value);
  });

  test('response value equal to msg[2] for knobtype=endless, valueType=absolute', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 127;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const r = c.getResponse(msg) as ThreeByteMidiArray;
    expect(r.value).toBe(value - (128 - 125));
  });
});

describe('toJSON', () => {
  test('stores valueType correctly', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 127;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless'
    );

    const json = stringify(c);

    const obj = parse<ContinuousPropagator>(json);

    expect(obj.valueType).toBe(c.valueType);
  });
});

describe('nextValue in endless->absolute mode', () => {
  test('handles APC-clockwise simulation', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = ThreeByteMidiArray.create(eventType, channel, number, 1);
    const r1 = c.nextV(m1);
    expect(r1).toBe(70);

    const m2 = ThreeByteMidiArray.create(eventType, channel, number, 2);
    const r2 = c.nextV(m2);
    expect(r2).toBe(72);
  });

  test('handles APC-counter-clockwise simulation', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = ThreeByteMidiArray.create(eventType, channel, number, 127);
    const r1 = c.nextV(m1);
    expect(r1).toBe(68);

    const m2 = ThreeByteMidiArray.create(eventType, channel, number, 126);
    const r2 = c.nextV(m2);
    expect(r2).toBe(66);
  });

  test('handles minilab-clockwise simulation', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = ThreeByteMidiArray.create(eventType, channel, number, 65);
    const r1 = c.nextV(m1);
    expect(r1).toBe(70);

    const m2 = ThreeByteMidiArray.create(eventType, channel, number, 66);
    const r2 = c.nextV(m2);
    expect(r2).toBe(72);
  });

  test('handles minilab-counter-clockwise simulation', () => {
    const or = 'continuous';
    const eventType = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      eventType,
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = ThreeByteMidiArray.create(eventType, channel, number, 63);
    const r1 = c.nextV(m1);
    expect(r1).toBe(68);

    const m2 = ThreeByteMidiArray.create(eventType, channel, number, 62);
    const r2 = c.nextV(m2);
    expect(r2).toBe(66);
  });
});
