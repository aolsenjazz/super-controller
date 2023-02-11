import { stringify, parse } from '@shared/util';
import { MidiArray } from '@shared/midi-array';
import { ContinuousPropagator as WrapMe } from '@shared/propagators';

const msg = MidiArray.create(176, 2, 34, 125);

class ContinuousPropagator extends WrapMe {
  getResponse(m: MidiArray) {
    return super.getResponse(m);
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

    const r = c.getResponse(msg);
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

    const r = c.getResponse(msg);
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
