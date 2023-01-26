import { setStatus } from '@shared/midi-util';
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

function createNoteOn(number = 0, channel: Channel = 0) {
  return setStatus([channel, number, 127], 'noteon');
}

function createNoteOff(number = 0, channel: Channel = 0) {
  return setStatus([channel, number, 127], 'noteoff');
}

function createCC(value = 0, number = 0, channel: Channel = 0) {
  return setStatus([channel, number, value], 'controlchange');
}

const NOTE_ON = createNoteOn();
const NOTE_OFF = createNoteOff();

test('input:gate output:gate flips state correctly', () => {
  const prop = createPropagator('gate', 'gate');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('off');
});

test('input:gate output:toggle flips state correctly', () => {
  const prop = createPropagator('gate', 'toggle');

  prop.handleMessage(NOTE_ON);
  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('off');
});

test('input:constant output:toggle flips state correctly', () => {
  const prop = createPropagator('constant', 'toggle');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('off');
});

test('input:toggle output:toggle flips state correctly', () => {
  const prop = createPropagator('toggle', 'toggle');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('off');
});

test('input:continuous output:continuous props correctly', () => {
  const msg1 = createCC(0);
  const msg2 = createCC(10);

  const prop = createPropagator('continuous', 'continuous', 'controlchange');

  const result1 = prop.handleMessage(msg1);
  expect(result1).toEqual(msg1);

  const result2 = prop.handleMessage(msg2);
  expect(result2).toEqual(msg2);
});

test('pitchbend propagator props correctly', () => {
  const prop = createPropagator('continuous', 'continuous', 'pitchbend');

  // 224 = pitchbend event on channel 0
  const msg1 = [224, 60, 60];

  const result = prop.handleMessage(msg1);
  expect(result).toEqual(msg1);
});

test('input:constant output:constant is always "off"', () => {
  const prop = createPropagator('constant', 'constant');

  expect(prop.state).toBe('off');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('off');

  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('off');
});

test('eligibleStates returns correct for output:gate', () => {
  const prop = createPropagator('gate', 'gate');
  expect(prop.eligibleStates).toEqual(['off', 'on']);
});

test('eligibleStates returns correct for output:toggle', () => {
  const prop = createPropagator('gate', 'toggle');
  expect(prop.eligibleStates).toEqual(['off', 'on']);
});

test('eligibleStates returns correct for output:continuous', () => {
  const prop = createPropagator('continuous', 'continuous');
  expect(prop.eligibleStates).toEqual([]);
});

test('creating input:continuous output:gate throws', () => {
  expect(() => {
    createPropagator('continuous', 'gate');
  }).toThrow();
});

test('creating input:continuous output:toggle throws', () => {
  expect(() => {
    createPropagator('continuous', 'toggle');
  }).toThrow();
});

test('creating input:gate output:continuous throws', () => {
  expect(() => {
    createPropagator('gate', 'continuous');
  }).toThrow();
});

test('creating input:toggle output:continuous throws', () => {
  expect(() => {
    createPropagator('toggle', 'continuous');
  }).toThrow();
});

test('creating input:constant output:continuous throws', () => {
  expect(() => {
    createPropagator('constant', 'continuous');
  }).toThrow();
});

test('creating input:toggle, output:gate throws', () => {
  expect(() => {
    createPropagator('toggle', 'gate');
  }).toThrow();
});
