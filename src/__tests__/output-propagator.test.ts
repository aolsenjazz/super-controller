import { MidiArray } from '@shared/midi-array';
import { OutputPropagator } from '@shared/propagators/output-propagator';
import { InputResponse } from '@shared/driver-types';

function createPropagator(
  ir: InputResponse,
  or: InputResponse,
  eventType: StatusString | 'noteon/noteoff' = 'noteon/noteoff',
  number: MidiNumber = 0,
  channel: Channel = 0,
  value?: MidiNumber
) {
  return new OutputPropagator(ir, or, eventType, number, channel, value);
}

const noteon = MidiArray.create(144, 0, 32, 127);
const noteoff = MidiArray.create(128, 0, 32, 0);

interface NamedCreateCC {
  value: MidiNumber;
  number: MidiNumber;
  channel: Channel;
}
function createCC({ value = 0, number = 0, channel = 0 }: NamedCreateCC) {
  return MidiArray.create('controlchange', channel, number, value);
}

describe('hr as gate', () => {
  test('or=gate overrides values correctly', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'gate',
      'controlchange',
      msg.number,
      msg.channel
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(noteon.value);
  });

  test('or=gate responds to both noteon and noteoff', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'gate',
      'controlchange',
      msg.number,
      msg.channel
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(noteon.value);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(result2.status).toEqual(msg.status);
    expect(result2.number).toEqual(msg.number);
    expect(result2.channel).toEqual(msg.channel);
    expect(result2.value).toEqual(noteoff.value);
  });

  test('or=toggle overrides values correctly', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'toggle',
      'controlchange',
      msg.number,
      msg.channel
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(noteon.value);
  });

  test('or=toggle only responds to noteon', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'toggle',
      'controlchange',
      msg.number,
      msg.channel
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(noteon.value);

    const result2 = propagator.handleMessage(noteoff);

    expect(result2).toBeNull();
  });

  test('or=constant flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'constant',
      'controlchange',
      msg.number,
      msg.channel,
      69
    );

    const result = propagator.handleMessage(noteon)!;
    expect(result.value).toEqual(msg.value);

    const result2 = propagator.handleMessage(noteoff);
    expect(result2).toBeNull();

    const result3 = propagator.handleMessage(noteon)!;
    expect(result3.value).toEqual(msg.value);
  });
});

describe('hr=toggle', () => {
  test('or=toggle flow works correctly', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'toggle',
      'toggle',
      'controlchange',
      msg.number,
      msg.channel
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(noteon.value);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(result2.status).toEqual(msg.status);
    expect(result2.number).toEqual(msg.number);
    expect(result2.channel).toEqual(msg.channel);
    expect(result2.value).toEqual(noteoff.value);
  });

  test('or=constant flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'toggle',
      'constant',
      'controlchange',
      msg.number,
      msg.channel,
      69
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(msg.value);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(result2.status).toEqual(msg.status);
    expect(result2.number).toEqual(msg.number);
    expect(result2.channel).toEqual(msg.channel);
    expect(result2.value).toEqual(msg.value);
  });
});

describe('hr=constant', () => {
  test('or=toggle flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'constant',
      'toggle',
      'controlchange',
      msg.number,
      msg.channel,
      69
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(127);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(result2.status).toEqual(msg.status);
    expect(result2.number).toEqual(msg.number);
    expect(result2.channel).toEqual(msg.channel);
    expect(result2.value).toEqual(0);
  });

  test('or=constant flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'constant',
      'constant',
      'controlchange',
      msg.number,
      msg.channel,
      69
    );

    const result = propagator.handleMessage(noteon)!;

    expect(result.status).toEqual(msg.status);
    expect(result.number).toEqual(msg.number);
    expect(result.channel).toEqual(msg.channel);
    expect(result.value).toEqual(69);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(result2.status).toEqual(msg.status);
    expect(result2.number).toEqual(msg.number);
    expect(result2.channel).toEqual(msg.channel);
    expect(result2.value).toEqual(69);
  });
});

describe('hr=continuous', () => {
  test('or=continuous flow works correctly', () => {
    const msg1 = createCC({ value: 60, number: 90, channel: 7 });
    const msg2 = createCC({ value: 70, number: 90, channel: 7 });
    const propagator = createPropagator(
      'continuous',
      'continuous',
      'noteon',
      noteon.number,
      noteon.channel,
      69
    );

    const result = propagator.handleMessage(msg1)!;

    expect(result.status).toEqual(noteon.status);
    expect(result.number).toEqual(noteon.number);
    expect(result.channel).toEqual(noteon.channel);
    expect(result.value).toEqual(60);

    const result2 = propagator.handleMessage(msg2)!;

    expect(result2.status).toEqual(noteon.status);
    expect(result2.number).toEqual(noteon.number);
    expect(result2.channel).toEqual(noteon.channel);
    expect(result2.value).toEqual(70);
  });
});

describe('toJSON', () => {
  test('serializes + deserializes stock values correctly', () => {
    const propagator = createPropagator(
      'continuous',
      'continuous',
      'noteon',
      noteon.number,
      noteon.channel,
      69
    );

    const json = propagator.toJSON(false);
    const obj = JSON.parse(json);

    expect(obj.hardwareResponse).toEqual(propagator.hardwareResponse);
    expect(obj.outputResponse).toEqual(propagator.outputResponse);
    expect(obj.eventType).toEqual(propagator.eventType);
    expect(obj.number).toEqual(propagator.number);
    expect(obj.channel).toEqual(propagator.channel);
    expect(obj.value).toEqual(propagator.value);
  });

  test('toJSON stores state', () => {
    const propagator = createPropagator(
      'gate',
      'gate',
      'controlchange',
      noteon.number,
      noteon.channel,
      69
    );

    const msg = propagator.handleMessage(noteon);

    const json = propagator.toJSON(true);
    const obj = JSON.parse(json);

    expect(obj.lastPropagated).toEqual(msg);
  });

  test('toJSON stores non-stock variables correct', () => {
    const newOutputResponse = 'toggle';
    const newNumber = 70;
    const newChannel = 7;
    const newValue = 60;
    const newStatus = 'controlchange';

    const propagator = createPropagator(
      'gate',
      'gate',
      'noteon/noteoff',
      noteon.number,
      noteon.channel,
      69
    );

    propagator.outputResponse = newOutputResponse;
    propagator.number = newNumber;
    propagator.channel = newChannel;
    propagator.value = newValue;
    propagator.eventType = newStatus;

    const json = propagator.toJSON(false);
    const obj = JSON.parse(json);

    expect(obj.outputResponse).toEqual(newOutputResponse);
    expect(obj.eventType).toEqual(newStatus);
    expect(obj.number).toEqual(newNumber);
    expect(obj.channel).toEqual(newChannel);
    expect(obj.value).toEqual(newValue);
  });
});
