import { Channel, setStatus } from '@shared/midi-util';
import { BinaryPropagator } from '@shared/propagators/binary-propagator';

function createPropagator(
  ir: 'gate' | 'toggle' | 'constant',
  or: 'gate' | 'toggle',
  onMsg?: number[],
  offMsg?: number[]
) {
  const on = onMsg || setStatus([1, 1, 1], 'noteon');
  const off = offMsg || setStatus([1, 1, 1], 'noteoff');
  return new BinaryPropagator(ir, or, on, off);
}

function createNoteOn(number = 0, channel: Channel = 0) {
  return setStatus([channel, number, 127], 'noteon');
}

function createNoteOff(number = 0, channel: Channel = 0) {
  return setStatus([channel, number, 0], 'noteoff');
}

const NOTE_ON = createNoteOn();
const NOTE_OFF = createNoteOff();

test('input:gate output:gate toggles state correctly', () => {
  const prop = createPropagator('gate', 'toggle');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('off');
});

test('input:toggle output:gate throws', () => {
  expect(() => {
    createPropagator('toggle', 'gate');
  }).toThrow();
});

test('input:constant output:gate toggles state correctly', () => {
  const prop = createPropagator('constant', 'gate');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('off');
});

test('input:gate output:toggle toggles state correctly', () => {
  const prop = createPropagator('gate', 'toggle');

  prop.handleMessage(NOTE_ON);
  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  prop.handleMessage(NOTE_OFF);
  expect(prop.state).toBe('off');
});

test('input:toggle output:toggle toggles state correctly', () => {
  const prop = createPropagator('toggle', 'toggle');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('off');
});

test('input:constant output:toggle toggles state correctly', () => {
  const prop = createPropagator('constant', 'toggle');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('on');

  prop.handleMessage(NOTE_ON);
  expect(prop.state).toBe('off');
});
