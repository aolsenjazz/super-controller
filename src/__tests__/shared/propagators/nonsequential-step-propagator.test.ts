import { NonsequentialStepPropagator as WrapMe } from '@shared/propagators';

class NonsequentialStepPropagator extends WrapMe {
  getResponse(arr: NumberArrayWithStatus) {
    return super.getResponse(arr);
  }
}

describe('getResponse', () => {
  test('returns correct result', () => {
    const steps = new Map<string, NumberArrayWithStatus>();
    const arr: NumberArrayWithStatus = [144, 9, 6]; // Manually building the MIDI array
    steps.set(JSON.stringify(arr), arr); // Using manually created array

    const prop = new NonsequentialStepPropagator(steps, arr);

    expect(prop.getResponse(arr)).toEqual(arr);
  });

  test('return undefined', () => {
    const steps = new Map<string, NumberArrayWithStatus>();
    const arr: NumberArrayWithStatus = [144, 9, 6]; // Manually building the MIDI array
    steps.set(JSON.stringify(arr), arr);

    const prop = new NonsequentialStepPropagator(steps, arr);

    const nonMatchingArr: NumberArrayWithStatus = [160, 3, 0]; // Non-matching array
    expect(prop.getResponse(nonMatchingArr)).toBeUndefined();
  });
});

describe('responseForStep', () => {
  test('returns correct result for arr', () => {
    const steps = new Map<string, NumberArrayWithStatus>();
    const arr: NumberArrayWithStatus = [144, 9, 6]; // Manually building the MIDI array
    steps.set(JSON.stringify(arr), arr);

    const prop = new NonsequentialStepPropagator(steps, arr);

    expect(prop.responseForStep(arr)).toEqual(arr);
  });

  test('return undefined', () => {
    const steps = new Map<string, NumberArrayWithStatus>();
    const arr: NumberArrayWithStatus = [144, 9, 6]; // Manually building the MIDI array
    steps.set(JSON.stringify(arr), arr);

    const prop = new NonsequentialStepPropagator(steps, arr);

    const nonMatchingArr: NumberArrayWithStatus = [160, 1, 2]; // Non-matching array
    expect(prop.responseForStep(nonMatchingArr)).toBeUndefined();
  });
});

describe('setStep', () => {
  test('sets a step', () => {
    const arr: NumberArrayWithStatus = [144, 9, 6]; // Manually building the MIDI array

    const prop = new NonsequentialStepPropagator(new Map(), arr);
    prop.setStep(arr, arr);

    expect(prop.responseForStep(arr)).toEqual(arr);
  });
});

describe('restoreDefaults', () => {
  test('restores defaults', () => {
    const steps = new Map<string, NumberArrayWithStatus>();
    const arr: NumberArrayWithStatus = [144, 9, 6]; // Manually building the MIDI array
    steps.set(JSON.stringify(arr), arr);

    const prop = new NonsequentialStepPropagator(steps, arr);

    const newStep: NumberArrayWithStatus = [160, 8, 5]; // New step array
    prop.setStep(arr, newStep);
    prop.restoreDefaults();

    expect(prop.responseForStep(arr)).toEqual(arr);
  });
});
