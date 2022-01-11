import { Channel, EventType, MidiValue } from 'midi-message-parser';

import {
  InputConfig,
  InputOverride,
  InputResponse,
  InputType,
} from '@shared/hardware-config/input-config';
import { InputDefault, Color } from '@shared/driver-types';

import { InputGroup } from '../renderer/input-group';

const GREEN = {
  name: 'green',
  eventType: 'noteon' as EventType,
  value: 3 as MidiValue,
  string: 'green',
  default: true,
};

const RED = {
  name: 'red',
  eventType: 'noteon' as EventType,
  value: 5 as MidiValue,
  string: 'red',
  default: false,
};

function createInput(
  seedNumber: Channel,
  eventType: EventType,
  response: InputResponse,
  inputType: InputType,
  availableColors: Color[] = [],
  lightConfig: Map<string, Color> = new Map()
) {
  const def: InputDefault = {
    number: seedNumber,
    channel: seedNumber,
    eventType,
    response,
  };
  const inputOverride: InputOverride = {
    lightConfig,
  };
  return new InputConfig(def, inputOverride, availableColors, true, inputType);
}

function createGatePadInput(
  seedNumber: Channel = 0,
  includeAvailableColors = false,
  includeLightConfig = false
) {
  const colors = includeAvailableColors ? [GREEN, RED] : [];
  const lightConfig = new Map<string, Color>();
  if (includeLightConfig) {
    lightConfig.set('on', GREEN);
    lightConfig.set('off', RED);
  }
  return createInput(
    seedNumber,
    'noteon/noteoff',
    'gate',
    'pad',
    colors,
    lightConfig
  );
}

function createXYInput(seedNumber: Channel = 0) {
  return createInput(seedNumber, 'pitchbend', 'linear', 'xy', [], new Map());
}

function createSliderInput(seedNumber: Channel = 0) {
  return createInput(seedNumber, 'controlchange', 'linear', 'slider');
}

test('labelForNumber returns number for inputs w/diff eventTypes', () => {
  const gate = createGatePadInput(0);
  const slider = createSliderInput(1);
  const group = new InputGroup([gate, slider]);
  expect(group.labelForNumber(3)).toBe('3');
});

test('labelForNumber returns number for empty inputs list', () => {
  const group = new InputGroup([]);
  expect(group.labelForNumber(3)).toBe('3');
});

test('labelForNumber includes default CC role', () => {
  const slider = createSliderInput(10);
  const group = new InputGroup([slider]);
  expect(group.labelForNumber(10).includes('default')).toBe(true);
});

test('labelForNumber includes input default status', () => {
  const slider = createSliderInput(10);
  const group = new InputGroup([slider]);
  expect(group.labelForNumber(9).includes('default')).toBe(false);
});

test('labelForChannel does not include default status', () => {
  const slider = createSliderInput(10);
  const group = new InputGroup([slider]);
  expect(group.labelForChannel(9).includes('default')).toBe(false);
});

test('labelForChannel includes default status', () => {
  const slider = createSliderInput(2);
  const group = new InputGroup([slider]);
  expect(group.labelForChannel(2).includes('default')).toBe(true);
});

test('labelForEventType returns correct eventType for multiple, similar inputs', () => {
  const pad1 = createGatePadInput(1);
  const pad2 = createGatePadInput(2);
  const group = new InputGroup([pad1, pad2]);
  expect(group.labelForEventType('noteon/noteoff')).toBe('noteon/noteoff');
});

test('labelForResponse returns correct response for group with similar inputs', () => {
  const pad1 = createGatePadInput(1);
  const group = new InputGroup([pad1]);
  expect(group.labelForResponse('gate')).toBe('gate [default]');
});

test('colorForState return null for unset availableColors', () => {
  const pad1 = createGatePadInput(0);
  const group = new InputGroup([pad1]);
  expect(group.colorForState('off')).toBe(null);
});

test('colorForState returns default for unset light config', () => {
  const pad1 = createGatePadInput(0, true);
  const group = new InputGroup([pad1]);
  expect(group.colorForState('on')).toBe(GREEN);
});

test('colorForState returns the correct color', () => {
  const pad1 = createGatePadInput(0, true, true);
  const group = new InputGroup([pad1]);
  expect(group.colorForState('off')).toBe(RED);
});

test('isMultiInput returns true for xy', () => {
  const xy = createXYInput(0);
  const xy2 = createXYInput(1);
  const group = new InputGroup([xy, xy2]);
  expect(group.isMultiInput).toBe(true);
});

test('number getter returns correct value for group', () => {
  const gate1 = createGatePadInput(1);
  const gate2 = createGatePadInput(1);
  const group = new InputGroup([gate1, gate2]);
  expect(group.number).toBe(1);
});

test('number getter returns <multiple values>', () => {
  const gate1 = createGatePadInput(0);
  const gate2 = createGatePadInput(1);
  const group = new InputGroup([gate1, gate2]);
  expect(group.number).toBe('<multiple values>');
});

test('eligibleEventTypes returns correct eventTypes for similar inputs', () => {
  const slider1 = createSliderInput(0);
  const slider2 = createSliderInput(1);
  const group = new InputGroup([slider1, slider2]);
  const eligibleEventTypes = [
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ];
  expect(JSON.stringify(group.eligibleEventTypes)).toBe(
    JSON.stringify(eligibleEventTypes)
  );
});

test('eligibleEventTypes returns correct eventTypes for different inputs', () => {
  const gate = createGatePadInput(0);
  const slider = createSliderInput(1);
  const group = new InputGroup([gate, slider]);
  expect(group.eligibleEventTypes.length).toBe(0);
});
