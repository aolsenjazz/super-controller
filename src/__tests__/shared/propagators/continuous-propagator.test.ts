import { ContinuousPropagator as WrapMe } from '@shared/propagators';

const msg = [178, 34, 125] as NumberArrayWithStatus;

class ContinuousPropagator extends WrapMe {
  getResponse(m: NumberArrayWithStatus) {
    return super.getResponse(m);
  }

  nextV(m: NumberArrayWithStatus) {
    return this.nextValue(m);
  }
}

describe('getResponse', () => {
  test('response value equal to msg.value for valueType = endless', () => {
    const or = 'continuous';
    const statusString = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 127;
    const c = new ContinuousPropagator(
      or,
      statusString,
      number,
      channel,
      value,
      'endless',
      'endless'
    );

    const r = c.getResponse(msg) as NumberArrayWithStatus;
    expect(r[2]).toBe(msg[2]);
  });

  test('response value equal to msg[2] for knobtype=endless, valueType=absolute', () => {
    const or = 'continuous';
    const statusString = 'controlchange';
    const number = 32;
    const channel = 3;
    const value = 127;
    const c = new ContinuousPropagator(
      or,
      statusString,
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const r = c.getResponse(msg);
    expect(r[2]).toBe(value - (128 - 125));
  });
});

describe('nextValue in endless->absolute mode', () => {
  test('handles APC-clockwise simulation', () => {
    const or = 'continuous';
    const status = 176;
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      'controlchange',
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = [status | channel, number, 1] as NumberArrayWithStatus;
    const r1 = c.nextV(m1);
    expect(r1).toBe(70);

    const m2 = [status | channel, number, 2] as NumberArrayWithStatus;
    const r2 = c.nextV(m2);
    expect(r2).toBe(72);
  });

  test('handles APC-counter-clockwise simulation', () => {
    const or = 'continuous';
    const status = 176;
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      'controlchange',
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = [status | channel, number, 127] as NumberArrayWithStatus;
    const r1 = c.nextV(m1);
    expect(r1).toBe(68);

    const m2 = [status | channel, number, 126] as NumberArrayWithStatus;
    const r2 = c.nextV(m2);
    expect(r2).toBe(66);
  });

  test('handles minilab-clockwise simulation', () => {
    const or = 'continuous';
    const status = 176;
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      'controlchange',
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = [status | channel, number, 65] as NumberArrayWithStatus;
    const r1 = c.nextV(m1);
    expect(r1).toBe(70);

    const m2 = [status | channel, number, 66] as NumberArrayWithStatus;
    const r2 = c.nextV(m2);
    expect(r2).toBe(72);
  });

  test('handles minilab-counter-clockwise simulation', () => {
    const or = 'continuous';
    const status = 176;
    const number = 32;
    const channel = 3;
    const value = 69;
    const c = new ContinuousPropagator(
      or,
      'controlchange',
      number,
      channel,
      value,
      'endless',
      'absolute'
    );

    const m1 = [status | channel, number, 63] as NumberArrayWithStatus;
    const r1 = c.nextV(m1);
    expect(r1).toBe(68);

    const m2 = [status | channel, number, 62] as NumberArrayWithStatus;
    const r2 = c.nextV(m2);
    expect(r2).toBe(66);
  });
});
