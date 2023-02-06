import { Propagator, CorrelatedResponse } from '@shared/propagators/propagator';
import { MidiArray } from '@shared/midi-array';
import { InputResponse } from '@shared/driver-types';

const noteoff = MidiArray.create(128, 0, 0, 0);
const noteon = MidiArray.create(144, 0, 0, 127);

class PropagatorWrapper<
  T extends InputResponse,
  U extends CorrelatedResponse<T>
> extends Propagator<T, U> {
  get ineligibleOutputResponses() {
    return ['continuous'] as InputResponse[];
  }

  protected getResponse(msg: MidiArray) {
    return msg;
  }
}

describe('handleMessage', () => {
  test('correct flow for hr=gate, or=gate', () => {
    const pw = new PropagatorWrapper('gate', 'gate');

    const r1 = pw.handleMessage(noteon);
    const r2 = pw.handleMessage(noteoff);

    expect(r1).toBe(noteon);
    expect(r2).toBe(noteoff);
  });

  test('correct flow for hr=gate, or=toggle', () => {
    const pw = new PropagatorWrapper('gate', 'toggle');

    const r1 = pw.handleMessage(noteon);
    const r2 = pw.handleMessage(noteoff);
    const r3 = pw.handleMessage(noteon);

    expect(r1).toBe(noteon);
    expect(r2).toBe(undefined);
    expect(r3).toBe(noteon);
  });

  test('correct flow for hr=toggle', () => {
    const pw = new PropagatorWrapper('toggle', 'toggle');

    const r1 = pw.handleMessage(noteon);
    const r2 = pw.handleMessage(noteoff);

    expect(r1).toBe(noteon);
    expect(r2).toBe(noteoff);
  });
});
