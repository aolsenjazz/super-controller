/**
 * Tests generated with ChatGPT
 */

import { parse, stringify } from '@shared/util';
import { NStepPropagator as WrapMe } from '@shared/propagators';
import { ThreeByteMidiArray, create } from '@shared/midi-array';

class NStepPropagator extends WrapMe {
  getSteps() {
    return this.steps;
  }

  getResponse() {
    return super.getResponse();
  }
}

const noteon = ThreeByteMidiArray.create(144, 0, 32, 127);
const noteoff = ThreeByteMidiArray.create(128, 0, 32, 0);

test('creating a valid NStepPropagator sets hardwareResponse correctly', () => {
  const steps = new Map();
  steps.set(0, [1, 2, 3]);
  steps.set(1, [4, 5, 6]);

  const propagator = new NStepPropagator('continuous', 'constant', steps);
  expect(propagator.hardwareResponse).toBe('continuous');
});

test('creating a valid NStepPropagator sets outputResponse correctly', () => {
  const steps = new Map();
  steps.set(0, [1, 2, 3]);
  steps.set(1, [4, 5, 6]);

  const propagator = new NStepPropagator('gate', 'gate', steps);
  expect(propagator.outputResponse).toBe('gate');
});

test('creating a valid NStepPropagator sets steps correctly', () => {
  const steps = new Map();
  steps.set(0, [1, 2, 3]);
  steps.set(1, [4, 5, 6]);
  const propagator = new NStepPropagator('gate', 'toggle', steps);
  expect(propagator.getSteps()).toEqual(steps);
});

test('an NStepPropagator created with 5 steps returns the first 3 steps correctly by calling getResponse three times', () => {
  const steps = new Map();
  steps.set(0, [1, 2, 3]);
  steps.set(1, [4, 5, 6]);
  steps.set(2, [7, 8, 9]);
  steps.set(3, [10, 11, 12]);
  steps.set(4, [13, 14, 15]);
  const propagator = new NStepPropagator('gate', 'toggle', steps);
  expect(propagator.getResponse()).toEqual([4, 5, 6]);
  expect(propagator.getResponse()).toEqual([7, 8, 9]);
  expect(propagator.getResponse()).toEqual([10, 11, 12]);
});

test('an NStepPropagator created with two steps returns #steps[0], then #steps[1], then #steps[0] when getResponse is called thrice', () => {
  const steps = new Map();
  steps.set(0, [1, 2, 3]);
  steps.set(1, [4, 5, 6]);
  const propagator = new NStepPropagator('gate', 'toggle', steps);
  expect(propagator.getResponse()).toEqual([4, 5, 6]);
  expect(propagator.getResponse()).toEqual([1, 2, 3]);
  expect(propagator.getResponse()).toEqual([4, 5, 6]);
});

test('getResponse returns undefined when called on a valid NStepPropagator with 0 steps', () => {
  const propagator = new NStepPropagator('gate', 'gate', new Map());
  expect(propagator.getResponse()).toBeUndefined();
});

describe('setStep', () => {
  test('setting step with MidiArray works', () => {
    const propagator = new NStepPropagator('gate', 'toggle', new Map());
    const mm = create('noteon', 4, 4, 4);
    propagator.setStep(2, mm);
    expect(propagator.responseForStep(2)).toBe(mm);
  });
  test('setting step with non-interactive midi array works', () => {
    const arr: NumberArrayWithStatus = [144, 5, 5];
    const propagator = new NStepPropagator('gate', 'toggle', new Map());
    propagator.setStep(2, arr);
    expect(propagator.responseForStep(2)!.array).toEqual(arr);
  });
});

describe('toJSON', () => {
  test('serializes + deserializes stock values correctly', () => {
    const steps = new Map();
    steps.set(0, noteon);
    steps.set(1, noteoff);
    const propagator = new NStepPropagator('gate', 'gate', steps);

    const json = stringify(propagator);
    const obj = parse<NStepPropagator>(json);

    expect(obj instanceof WrapMe).toBe(true);
    expect(JSON.stringify(obj)).toEqual(JSON.stringify(propagator));
  });

  test('toJSON stores state', () => {
    const steps = new Map();
    steps.set(0, noteon);
    steps.set(1, noteoff);
    const propagator = new NStepPropagator('gate', 'gate', steps);

    propagator.getResponse();

    const json = stringify(propagator);
    const obj = parse<NStepPropagator>(json);

    expect(obj.currentStep).toEqual(1);
  });

  test('toJSON stores non-stock variables correct', () => {
    const newOutputResponse = 'toggle';
    const newStep2 = noteon;
    const steps = new Map();
    steps.set(0, noteon);
    steps.set(1, noteoff);

    const propagator = new NStepPropagator('gate', 'gate', steps);

    propagator.outputResponse = newOutputResponse;
    propagator.setStep(1, newStep2);

    const json = stringify(propagator);
    const obj = parse<NStepPropagator>(json);

    expect(obj instanceof WrapMe).toBe(true);
    expect(JSON.stringify(obj)).toEqual(JSON.stringify(propagator));
  });
});
