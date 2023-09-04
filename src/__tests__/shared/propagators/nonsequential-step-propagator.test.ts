import { MidiArray, create } from '@shared/midi-array';
import { NonsequentialStepPropagator as WrapMe } from '@shared/propagators';
import { stringify, parse } from '@shared/util';

class NonsequentialStepPropagator extends WrapMe {
  getResponse(arr: MidiArray) {
    return super.getResponse(arr);
  }
}

describe('toJSON', () => {
  test('de/serializing transfers props correctly', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    steps.set(JSON.stringify(arr), create(arr));

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );
    const json = stringify(prop);
    const result = parse<NonsequentialStepPropagator>(json);

    expect(stringify(result)).toBe(stringify(prop));
  });
});

describe('getResponse', () => {
  test('returns correct result', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );

    expect(prop.getResponse(ma)).toEqual(ma);
  });

  test('return undefined', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );

    expect(prop.getResponse(create([160, 3, 0]))).toBeUndefined();
  });
});

describe('responseForStep', () => {
  test('returns correct result for string', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );

    expect(prop.responseForStep(JSON.stringify(arr))).toEqual(ma);
  });

  test('returns correct result for arr', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );

    expect(prop.responseForStep(arr)).toEqual(ma);
  });

  test('return undefined', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );

    expect(prop.responseForStep([160, 1, 2])).toBeUndefined();
  });
});

describe('setStep', () => {
  test('sets a step', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      new Map(),
      arr
    );
    prop.setStep(arr, ma);

    expect(prop.responseForStep(arr)).toEqual(ma);
  });
});

describe('restoreDefaults', () => {
  test('restores defaults', () => {
    const status = 'controlchange';
    const channel = 5;
    const number = 3;
    const steps = new Map<string, MidiArray>();
    const arr: NumberArrayWithStatus = [144, 9, 6];
    const ma = create(arr);
    steps.set(JSON.stringify(arr), ma);

    const prop = new NonsequentialStepPropagator(
      status,
      channel,
      number,
      steps,
      arr
    );

    const newStep = create([160, 8, 5]);
    prop.setStep(arr, newStep);
    prop.restoreDefaults();

    expect(prop.responseForStep(arr)).toEqual(ma);
  });
});
