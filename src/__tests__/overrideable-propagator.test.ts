import { MidiArray } from '@shared/midi-array';
import { InputResponse } from '@shared/driver-types';
import { OverrideablePropagator } from '@shared/propagators';
import { CorrelatedResponse } from '@shared/propagators/propagator';

class Wrapper<
  T extends InputResponse,
  U extends CorrelatedResponse<T>
> extends OverrideablePropagator<T, U> {
  getResponse(msg: MidiArray) {
    return msg;
  }

  nextEventType() {
    return this.eventType === 'noteon/noteoff' ? 'noteon' : this.eventType;
  }

  handleAsConstant(msg: MidiArray) {
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
    expect(from.eventType).toBe(et);
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

  const msg = MidiArray.create(128, 5, 60, 126);

  test('propagates value=127 when value unset', () => {
    const r = w.handleAsConstant(msg);
    expect(r.value).toBe(127);
  });

  test('returns correct, overridden values', () => {
    w.value = 120;
    w.eventType = 'noteon';
    w.number = 70;
    w.channel = 9;

    const r = w.handleAsConstant(msg);

    expect(r.statusString).toBe('noteon');
    expect(r.value).toBe(120);
    expect(r.number).toBe(70);
    expect(r.channel).toBe(9);
  });
});
