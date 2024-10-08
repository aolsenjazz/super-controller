import { InputResponse } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { StatefulPropagator } from '@shared/propagators/stateful-propagator';

class Wrapper<
  T extends InputResponse,
  U extends InputResponse
> extends StatefulPropagator<T, U> {
  getResponse(msg: NumberArrayWithStatus) {
    return msg;
  }

  get ineligibleOutputResponses() {
    return [];
  }

  nextEventType() {
    return super.nextEventType();
  }
}

describe('nextEventType', () => {
  test('returns noteoff for `on` state', () => {
    const hr = 'gate';
    const or = 'toggle';
    const et = 'noteon/noteoff';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(hr, or, et, number, channel, value, 'on');

    const result = w.nextEventType();
    expect(result).toBe('noteoff');
  });

  test('returns noteon for `off` state', () => {
    const hr = 'gate';
    const or = 'toggle';
    const et = 'noteon/noteoff';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(hr, or, et, number, channel, value, 'off');

    const result = w.nextEventType();
    expect(result).toBe('noteon');
  });

  test('returns statusString for non-`noteon/noteoff` statusString', () => {
    const hr = 'gate';
    const or = 'toggle';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(hr, or, et, number, channel, value, 'off');

    const result = w.nextEventType();
    expect(result).toBe('controlchange');
  });
});
