import {
  EventType,
  Channel,
  MidiValue,
  MidiMessage,
} from 'midi-message-parser';
import { OutputPropagator } from '@shared/propagators/output-propagator';
import { InputResponse } from '@shared/hardware-config/input-config';

function createPropagator(
  ir: InputResponse,
  or: InputResponse,
  eventType: EventType = 'noteon/noteoff',
  number: MidiValue = 0,
  channel: Channel = 0,
  value?: MidiValue
) {
  return new OutputPropagator(ir, or, eventType, number, channel, value);
}

function createNoteOn(number: MidiValue = 0, channel: Channel = 0) {
  const mm = new MidiMessage('noteon', number, 127, channel, 0);
  return mm.toMidiArray();
}

function createNoteOff(number: MidiValue = 0, channel: Channel = 0) {
  const mm = new MidiMessage('noteoff', number, 0, channel, 0);
  return mm.toMidiArray();
}

function createCC(
  value: MidiValue = 0,
  number: MidiValue = 0,
  channel: Channel = 0
) {
  const mm = new MidiMessage('controlchange', number, value, channel, 0);
  return mm.toMidiArray();
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

test('input:linear output:linear props correctly', () => {
  const msg1 = createCC(0);
  const msg2 = createCC(10);

  const prop = createPropagator('linear', 'linear', 'controlchange');

  const result1 = prop.handleMessage(msg1);
  expect(result1).toEqual(msg1);

  const result2 = prop.handleMessage(msg2);
  expect(result2).toEqual(msg2);
});

test('pitchbend propagator props correctly', () => {
  const prop = createPropagator('linear', 'linear', 'pitchbend');

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

test('eligibleStates returns correct for output:linear', () => {
  const prop = createPropagator('linear', 'linear');
  expect(prop.eligibleStates).toEqual([]);
});

test('creating input:linear output:gate throws', () => {
  expect(() => {
    createPropagator('linear', 'gate');
  }).toThrow();
});

test('creating input:linear output:toggle throws', () => {
  expect(() => {
    createPropagator('linear', 'toggle');
  }).toThrow();
});

test('creating input:gate output:linear throws', () => {
  expect(() => {
    createPropagator('gate', 'linear');
  }).toThrow();
});

test('creating input:toggle output:linear throws', () => {
  expect(() => {
    createPropagator('toggle', 'linear');
  }).toThrow();
});

test('creating input:constant output:linear throws', () => {
  expect(() => {
    createPropagator('constant', 'linear');
  }).toThrow();
});

test('creating input:toggle, output:gate throws', () => {
  expect(() => {
    createPropagator('toggle', 'gate');
  }).toThrow();
});
