import { Channel, MidiValue, MidiMessage } from 'midi-message-parser';
import { BinaryPropagator } from '@shared/propagators/binary-propagator';

function createPropagator(
  ir: 'gate' | 'toggle' | 'constant',
  or: 'gate' | 'toggle',
  onMsg?: MidiMessage,
  offMsg?: MidiMessage
) {
  const on = onMsg || new MidiMessage('noteon', 0, 0, 0, 0);
  const off = offMsg || new MidiMessage('noteoff', 0, 0, 0, 0);
  return new BinaryPropagator(ir, or, on, off);
}

function createNoteOn(number: MidiValue = 0, channel: Channel = 0) {
  const mm = new MidiMessage('noteon', number, 127, channel, 0);
  return mm.toMidiArray();
}

function createNoteOff(number: MidiValue = 0, channel: Channel = 0) {
  const mm = new MidiMessage('noteoff', number, 0, channel, 0);
  return mm.toMidiArray();
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
