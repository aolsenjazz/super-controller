import { Propagator, TESTABLES } from '@shared/propagators/propagator';
import { MidiArray } from '@shared/midi-array';
import {
  propagatorFromJSON,
  OutputPropagator,
  NStepPropagator,
} from '@shared/propagators';
import { InputResponse } from '@shared/driver-types';

const illogicalPairs: [InputResponse, InputResponse][] =
  TESTABLES.get('illogicalPairs')!;

class PropagatorWrapper extends Propagator {
  protected getResponse(msg: MidiArray): MidiArray | null {
    return msg;
  }

  toJSON(includeState: boolean): string {
    return JSON.stringify({
      hardwareResponse: this.hardwareResponse,
      outputResponse: this.outputResponse,
      lastPropagated: includeState ? this.lastPropagated : undefined,
    });
  }
}

describe('PropagatorWrapper', () => {
  illogicalPairs.forEach((pair) => {
    it(`throws error when trying to create with illogical pair ${pair[0]} and ${pair[1]}`, () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new PropagatorWrapper(pair[0], pair[1]);
      }).toThrowError(
        `InputResponse[${pair[0]}] and OutputResponse[${pair[1]}] is illogical`
      );
    });
  });
});

test('constructor a valid PropagatorWrapper correctly sets the hardwareResponse variable', () => {
  type T = {
    hardwareResponse: InputResponse;
    outputResponse: InputResponse;
  };
  const testCases: T[] = [
    { hardwareResponse: 'gate', outputResponse: 'gate' },
    { hardwareResponse: 'gate', outputResponse: 'toggle' },
    { hardwareResponse: 'gate', outputResponse: 'constant' },
    { hardwareResponse: 'toggle', outputResponse: 'toggle' },
    { hardwareResponse: 'toggle', outputResponse: 'constant' },
    { hardwareResponse: 'continuous', outputResponse: 'continuous' },
    { hardwareResponse: 'continuous', outputResponse: 'constant' },
    { hardwareResponse: 'constant', outputResponse: 'constant' },
  ];

  testCases.forEach((testCase) => {
    const { hardwareResponse, outputResponse } = testCase;
    const wrapper = new PropagatorWrapper(hardwareResponse, outputResponse);
    expect(wrapper.hardwareResponse).toBe(hardwareResponse);
  });
});

describe('setResponse', () => {
  test('calling wrapper.setResponse using an InputResponse that will result in an illogical pair throws an error', () => {
    const wrapper = new PropagatorWrapper('gate', 'constant');
    expect(() => {
      wrapper.outputResponse = 'continuous';
    }).toThrow();
  });

  test('calling wrapper.setResponse using a logical InputResponse does not throw', () => {
    const wrapper = new PropagatorWrapper('gate', 'gate');
    expect(() => {
      wrapper.outputResponse = 'toggle';
    }).not.toThrow();
  });
});

describe('handleMessage', () => {
  test('handleMessage returns expected output for hardwareResponse "gate" and outputResponse "gate"', () => {
    const wrapper = new PropagatorWrapper('gate', 'gate');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const expectedOutput = noteOnMessage;

    expect(wrapper.handleMessage(noteOnMessage)).toEqual(expectedOutput);
  });

  test('handleMessage returns expected output for hardwareResponse "gate" and outputResponse "toggle"', () => {
    const wrapper = new PropagatorWrapper('gate', 'toggle');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);
    const expectedOutput = noteOnMessage;

    expect(wrapper.handleMessage(noteOnMessage)).toEqual(expectedOutput);
    expect(wrapper.handleMessage(noteOffMessage)).toEqual(null);
  });

  test('handleMessage returns expected output for hardwareResponse "gate" and outputResponse "constant"', () => {
    const wrapper = new PropagatorWrapper('gate', 'constant');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);
    const expectedOutput = noteOnMessage;

    expect(wrapper.handleMessage(noteOnMessage)).toEqual(expectedOutput);
    expect(wrapper.handleMessage(noteOffMessage)).toEqual(null);
  });

  test('handleMessage returns expected output for hardwareResponse "toggle" and outputResponse "toggle"', () => {
    const wrapper = new PropagatorWrapper('toggle', 'toggle');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);
    const expectedOutput = noteOnMessage;

    expect(wrapper.handleMessage(noteOnMessage)).toEqual(expectedOutput);
    expect(wrapper.handleMessage(noteOffMessage)).toEqual(noteOffMessage);
  });

  test('handleMessage with hardwareResponse "gate" and outputResponse "toggle" does not return a response for noteoff messages', () => {
    const wrapper = new PropagatorWrapper('gate', 'toggle');
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);
    const response = wrapper.handleMessage(noteOffMessage);
    expect(response).toBeNull();
  });

  test('handleMessage with hardwareResponse "toggle" returns the correct response for noteoff messages', () => {
    const wrapper = new PropagatorWrapper('toggle', 'toggle');
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);
    const expectedResponse = noteOffMessage;
    const response = wrapper.handleMessage(noteOffMessage);
    expect(response).toEqual(expectedResponse);
  });

  test('handleMessage() returns correct output for gate hardwareResponse', () => {
    const wrapper = new PropagatorWrapper('gate', 'gate');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);

    let response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
    response = wrapper.handleMessage(noteOffMessage);
    expect(response).toEqual(noteOffMessage);

    wrapper.outputResponse = 'toggle';
    response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
    response = wrapper.handleMessage(noteOffMessage);
    expect(response).toBeNull();

    wrapper.outputResponse = 'constant';
    response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
    response = wrapper.handleMessage(noteOffMessage);
    expect(response).toBeNull();
  });

  test('handleMessage() returns correct output for constant hardwareResponse', () => {
    const wrapper = new PropagatorWrapper('constant', 'constant');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const noteOffMessage = MidiArray.create(128, 0, 60, 100);

    let response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
    response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);

    wrapper.outputResponse = 'gate';
    response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
    response = wrapper.handleMessage(noteOffMessage);
    expect(response).toEqual(noteOffMessage);

    wrapper.outputResponse = 'toggle';
    response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
    response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(noteOnMessage);
  });

  test('handleMessage() returns null when input message noteOn/Off velocity is 0', () => {
    const wrapper = new PropagatorWrapper('constant', 'constant');
    const noteOnMessage = MidiArray.create(144, 0, 60, 0);
    const response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual(response);
  });

  test('handleMessage() returns expected output for "gate" hardwareResponse and "gate" outputResponse with noteOn message', () => {
    const wrapper = new PropagatorWrapper('gate', 'gate');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual([144, 60, 100]);
  });

  test('handleMessage() returns expected output for "gate" hardwareResponse and "toggle" outputResponse with noteOn message', () => {
    const wrapper = new PropagatorWrapper('gate', 'toggle');
    const noteOnMessage = MidiArray.create(144, 0, 60, 100);
    const response = wrapper.handleMessage(noteOnMessage);
    expect(response).toEqual([144, 60, 100]);
  });
});

describe('propagatorFromJSON', () => {
  test('propagatorFromJSON correctly restores OutputPropagator with state', () => {
    const hr = 'gate';
    const or = 'gate';
    const et = 'noteon/noteoff';
    const number = 50;
    const channel = 9;
    const value = 3;
    const lastPropagated = MidiArray.create(144, 0, 100, 100);
    const prop = new OutputPropagator(
      hr,
      or,
      et,
      number,
      channel,
      value,
      lastPropagated
    );
    const json = prop.toJSON(true);
    const newObj = propagatorFromJSON(json) as OutputPropagator;

    expect(newObj.hardwareResponse).toEqual(hr);
    expect(newObj.outputResponse).toEqual(or);
    expect(newObj.eventType).toEqual(et);
    expect(newObj.number).toEqual(number);
    expect(newObj.channel).toEqual(channel);
    expect(newObj.value).toEqual(value);
    expect(newObj.lastPropagated).toEqual(lastPropagated);
  });

  test('propagatorFromJSON correct restores DevicePropagator with state', () => {
    const hr = 'gate';
    const or = 'gate';
    const currentStep = 2;
    const steps = new Map();

    steps.set(1, MidiArray.create(144, 0, 100, 100));
    steps.set(2, MidiArray.create(144, 0, 100, 101));
    steps.set(3, MidiArray.create(144, 0, 100, 102));

    const prop = new NStepPropagator(hr, or, steps, currentStep);
    const json = prop.toJSON(true);
    const newObj = propagatorFromJSON(json) as NStepPropagator;

    expect(newObj.hardwareResponse).toEqual(hr);
    expect(newObj.outputResponse).toEqual(or);
    expect(newObj.TESTABLES.get('steps')).toEqual(steps);
    expect(newObj.currentStep).toEqual(currentStep);
  });
});
