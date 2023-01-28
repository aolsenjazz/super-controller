import { setStatus, getChannel, getStatus } from '@shared/midi-util';
import { OutputPropagator } from '@shared/propagators/output-propagator';
import { InputResponse } from '@shared/driver-types';

function createPropagator(
  ir: InputResponse,
  or: InputResponse,
  eventType: StatusString | 'noteon/noteoff' = 'noteon/noteoff',
  number = 0,
  channel: Channel = 0,
  value?: number
) {
  return new OutputPropagator(ir, or, eventType, number, channel, value);
}

const noteon = [144, 32, 127];
const noteoff = [128, 32, 0];

function getNumber(msg: number[]) {
  return msg[0];
}

function getValue(msg: number[]) {
  return msg[2];
}

interface NamedCreateCC {
  value: number;
  number: number;
  channel: Channel;
}
function createCC({ value = 0, number = 0, channel = 0 }: NamedCreateCC) {
  return setStatus([channel, number, value], 'controlchange');
}

describe('hr as gate', () => {
  test('or=gate overrides values correctly', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'gate',
      'controlchange',
      getNumber(msg),
      getChannel(msg)
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(getValue(noteon));
  });

  test('or=gate responds to both noteon and noteoff', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'gate',
      'controlchange',
      getNumber(msg),
      getChannel(msg)
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(getValue(noteon));

    const result2 = propagator.handleMessage(noteoff)!;

    expect(getStatus(result2)).toEqual(getStatus(msg));
    expect(getNumber(result2)).toEqual(getNumber(msg));
    expect(getChannel(result2)).toEqual(getChannel(msg));
    expect(getValue(result2)).toEqual(getValue(noteoff));
  });

  test('or=toggle overrides values correctly', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'toggle',
      'controlchange',
      getNumber(msg),
      getChannel(msg)
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(getValue(noteon));
  });

  test('or=toggle only responds to noteon', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'toggle',
      'controlchange',
      getNumber(msg),
      getChannel(msg)
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(getValue(noteon));

    const result2 = propagator.handleMessage(noteoff);

    expect(result2).toBeNull();
  });

  test('or=constant flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'gate',
      'constant',
      'controlchange',
      getNumber(msg),
      getChannel(msg),
      69
    );

    const result = propagator.handleMessage(noteon)!;
    expect(getValue(result)).toEqual(getValue(msg));

    const result2 = propagator.handleMessage(noteoff);
    expect(result2).toBeNull();

    const result3 = propagator.handleMessage(noteon)!;
    expect(getValue(result3)).toEqual(getValue(msg));
  });
});

describe('hr=toggle', () => {
  test('or=toggle flow works correctly', () => {
    const msg = createCC({ value: 127, number: 90, channel: 7 });
    const propagator = createPropagator(
      'toggle',
      'toggle',
      'controlchange',
      getNumber(msg),
      getChannel(msg)
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(getValue(noteon));

    const result2 = propagator.handleMessage(noteoff)!;

    expect(getStatus(result2)).toEqual(getStatus(msg));
    expect(getNumber(result2)).toEqual(getNumber(msg));
    expect(getChannel(result2)).toEqual(getChannel(msg));
    expect(getValue(result2)).toEqual(getValue(noteoff));
  });

  test('or=constant flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'toggle',
      'constant',
      'controlchange',
      getNumber(msg),
      getChannel(msg),
      69
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(getValue(msg));

    const result2 = propagator.handleMessage(noteoff)!;

    expect(getStatus(result2)).toEqual(getStatus(msg));
    expect(getNumber(result2)).toEqual(getNumber(msg));
    expect(getChannel(result2)).toEqual(getChannel(msg));
    expect(getValue(result2)).toEqual(getValue(msg));
  });
});

describe('hr=constant', () => {
  test('or=toggle flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'constant',
      'toggle',
      'controlchange',
      getNumber(msg),
      getChannel(msg),
      69
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(127);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(getStatus(result2)).toEqual(getStatus(msg));
    expect(getNumber(result2)).toEqual(getNumber(msg));
    expect(getChannel(result2)).toEqual(getChannel(msg));
    expect(getValue(result2)).toEqual(0);
  });

  test('or=constant flow works correctly', () => {
    const msg = createCC({ value: 69, number: 90, channel: 7 });
    const propagator = createPropagator(
      'constant',
      'constant',
      'controlchange',
      getNumber(msg),
      getChannel(msg),
      69
    );

    const result = propagator.handleMessage(noteon)!;

    expect(getStatus(result)).toEqual(getStatus(msg));
    expect(getNumber(result)).toEqual(getNumber(msg));
    expect(getChannel(result)).toEqual(getChannel(msg));
    expect(getValue(result)).toEqual(69);

    const result2 = propagator.handleMessage(noteoff)!;

    expect(getStatus(result2)).toEqual(getStatus(msg));
    expect(getNumber(result2)).toEqual(getNumber(msg));
    expect(getChannel(result2)).toEqual(getChannel(msg));
    expect(getValue(result2)).toEqual(69);
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
      getNumber(noteon),
      getChannel(noteon),
      69
    );

    const result = propagator.handleMessage(msg1)!;

    expect(getStatus(result)).toEqual(getStatus(noteon));
    expect(getNumber(result)).toEqual(getNumber(noteon));
    expect(getChannel(result)).toEqual(getChannel(noteon));
    expect(getValue(result)).toEqual(60);

    const result2 = propagator.handleMessage(msg2)!;

    expect(getStatus(result2)).toEqual(getStatus(noteon));
    expect(getNumber(result2)).toEqual(getNumber(noteon));
    expect(getChannel(result2)).toEqual(getChannel(noteon));
    expect(getValue(result2)).toEqual(70);
  });
});

describe('toJSON', () => {
  test('serializes + deserializes stock values correctly', () => {
    const propagator = createPropagator(
      'continuous',
      'continuous',
      'noteon',
      getNumber(noteon),
      getChannel(noteon),
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
      getNumber(noteon),
      getChannel(noteon),
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
      getNumber(noteon),
      getChannel(noteon),
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
