import { MidiArray, create } from '@shared/midi-array';
import { NonsequentialStepPropagator as WrapMe } from '@shared/propagators';

class NonsequentialStepPropagator extends WrapMe {
  getResponse(arr: MidiArray) {
    return super.getResponse(arr);
  }
}

describe('getResponse', () => {
  test('returns correct result', () => {
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(steps, arr);

    expect(prop.getResponse(ma)).toEqual(ma);
  });

  test('return undefined', () => {
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(steps, arr);

    expect(prop.getResponse(create([160, 3, 0]))).toBeUndefined();
  });
});

describe('responseForStep', () => {
  test('returns correct result for arr', () => {
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(steps, arr);

    expect(prop.responseForStep(arr)).toEqual(ma);
  });

  test('return undefined', () => {
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(steps, arr);

    expect(prop.responseForStep([160, 1, 2])).toBeUndefined();
  });
});

describe('setStep', () => {
  test('sets a step', () => {
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);

    const prop = new NonsequentialStepPropagator(new Map(), arr);
    prop.setStep(arr, ma);

    expect(prop.responseForStep(arr)).toEqual(ma);
  });
});

describe('restoreDefaults', () => {
  test('restores defaults', () => {
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(steps, arr);

    const newStep = create([160, 8, 5]);
    prop.setStep(arr, newStep);
    prop.restoreDefaults();

    expect(prop.responseForStep(arr)).toEqual(ma);
  });
});
