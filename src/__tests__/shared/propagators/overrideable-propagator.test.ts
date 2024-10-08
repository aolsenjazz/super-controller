import { InputResponse } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { OverrideablePropagator } from '@shared/propagators';

class Wrapper<
  T extends InputResponse,
  U extends InputResponse
> extends OverrideablePropagator<T, U> {
  getResponse(msg: NumberArrayWithStatus) {
    return msg;
  }

  nextEventType() {
    return this.statusString === 'noteon/noteoff'
      ? 'noteon'
      : this.statusString;
  }

  handleAsConstant(msg: NumberArrayWithStatus) {
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

  const msg: NumberArrayWithStatus = [128, 5, 60]; // Manually building the MIDI array

  test('propagates value=127 when value unset', () => {
    const r = w.handleAsConstant(msg) as NumberArrayWithStatus;
    expect(r[2]).toBe(127); // r.value becomes r[2] for the MIDI value
  });

  test('returns correct, overridden values', () => {
    w.value = 120;
    w.statusString = 'noteon';
    w.number = 70;
    w.channel = 9;

    const r = w.handleAsConstant(msg) as NumberArrayWithStatus;

    expect(w.statusString).toBe('noteon');
    expect(r[2]).toBe(120); // r.value becomes r[2]
    expect(r[1]).toBe(70); // r.number becomes r[1]
    expect(r[0] & 0x0f).toBe(9); // r.channel derived from r[0]
  });
});
