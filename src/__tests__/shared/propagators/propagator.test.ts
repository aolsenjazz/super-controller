import { Propagator } from '@shared/propagators/propagator';
import { InputResponse } from '@shared/driver-types/input-drivers/mono-interactive-driver';

const noteoff: NumberArrayWithStatus = [128, 0, 0]; // Manually building the MIDI array for note off
const noteon: NumberArrayWithStatus = [144, 0, 127]; // Manually building the MIDI array for note on

class PropagatorWrapper<
  T extends InputResponse,
  U extends InputResponse
> extends Propagator<T, U> {
  get ineligibleOutputResponses() {
    return ['continuous'] as InputResponse[];
  }

  protected getResponse(msg: NumberArrayWithStatus) {
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
