import { MidiArray } from '@shared/midi-array';
import { InputResponse } from '@shared/driver-types';
import { CorrelatedResponse } from '@shared/propagators/propagator';
import { StatefulPropagator } from '@shared/propagators/stateful-propagator';

class Wrapper<
  T extends InputResponse,
  U extends CorrelatedResponse<T>
> extends StatefulPropagator<T, U> {
  getResponse(msg: MidiArray) {
    return msg;
  }

  get ineligibleOutputResponses() {
    return [];
  }

  nextEventType() {
    return super.nextEventType();
  }
}

describe('toJSON', () => {
  test('serializes+deserializes state correctly', () => {
    const hr = 'gate';
    const or = 'toggle';
    const et = 'controlchange';
    const number = 32;
    const channel = 2;
    const value = 100;
    const w = new Wrapper(hr, or, et, number, channel, value, 'on');

    const json = JSON.stringify(w);
    const from = JSON.parse(json);

    expect(from.state).toBe(w.state);
    expect(from.outputResponse).toBe(w.outputResponse);
  });
});

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

  test('returns eventType for non-`noteon/noteoff` eventType', () => {
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
