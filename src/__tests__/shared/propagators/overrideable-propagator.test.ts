import { ThreeByteMidiArray } from '@shared/midi-array';
import { InputResponse } from '@shared/driver-types';
import { OverrideablePropagator } from '@shared/propagators';

class Wrapper<
  T extends InputResponse,
  U extends InputResponse
> extends OverrideablePropagator<T, U> {
  getResponse(msg: ThreeByteMidiArray) {
    return msg;
  }

  nextEventType() {
    return this.statusString === 'noteon/noteoff'
      ? 'noteon'
      : this.statusString;
  }

  handleAsConstant(msg: ThreeByteMidiArray) {
    return super.handleAsConstant(msg);
  }
}

describe('toJSON', () => {
  test('serial/deserializes correctly', () => {
    const hr = 'gate';
    const or = 'toggle';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(hr, or, et, number, channel, value);

    const json = JSON.stringify(w);
    const from = JSON.parse(json);

    expect(from.hardwareResponse).toBe(hr);
    expect(from.outputResponse).toBe(or);
    expect(from.statusString).toBe(et);
    expect(from.number).toBe(number);
    expect(from.channel).toBe(channel);
    expect(from.value).toBe(value);
  });
});

describe('handleAsConstant', () => {
  const hr = 'gate';
  const or = 'toggle';
  const et = 'controlchange';
  const number = 32;
  const channel = 2;
  const w = new Wrapper(hr, or, et, number, channel);

  const msg = ThreeByteMidiArray.create(128, 5, 60, 126);

  test('propagates value=127 when value unset', () => {
    const r = w.handleAsConstant(msg) as ThreeByteMidiArray;
    expect(r.value).toBe(127);
  });

  test('returns correct, overridden values', () => {
    w.value = 120;
    w.statusString = 'noteon';
    w.number = 70;
    w.channel = 9;

    const r = w.handleAsConstant(msg) as ThreeByteMidiArray;

    expect(r.statusString).toBe('noteon');
    expect(r.value).toBe(120);
    expect(r.number).toBe(70);
    expect(r.channel).toBe(9);
  });
});
