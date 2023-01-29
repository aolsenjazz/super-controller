import { InputConfig, ColorImpl } from '@shared/hardware-config';
import { NStepPropagator } from '@shared/propagators';
import { Color, InputResponse, InputType } from '@shared/driver-types';

import { InputGroup } from '../renderer/input-group';

const GREEN = {
  name: 'green',
  eventType: 'noteon' as StatusString,
  value: 3,
  string: 'green',
  default: true,
  fx: [],
};

const RED = {
  name: 'red',
  eventType: 'noteon' as StatusString,
  value: 5,
  string: 'red',
  default: false,
  fx: [],
};

function createInput(
  seedNumber: Channel,
  eventType: StatusString | 'noteon/noteoff',
  response: InputResponse,
  inputType: InputType,
  availableColors: Color[] = [],
  lightConfig: Map<number, Color> = new Map()
) {
  const def: InputConfig['default'] = {
    number: seedNumber,
    channel: seedNumber,
    eventType,
    response,
  };
  const avail = availableColors.map(
    (c) => new ColorImpl(c, def.number, def.channel)
  );
  const config = new Map<number, number[]>();
  lightConfig.forEach((v, k) => {
    config.set(k, new ColorImpl(v, def.number, def.channel).toMidiArray());
  });

  const outputPropagator = undefined;
  let devicePropagator;
  if (lightConfig) {
    devicePropagator = new NStepPropagator(def.response, def.response, config);
  }

  return new InputConfig(
    def,
    avail,
    true,
    inputType,
    0,
    outputPropagator,
    devicePropagator
  );
}

function createGatePadInput(
  seedNumber: Channel = 0,
  includeAvailableColors = false,
  includeLightConfig = false
) {
  const colors = includeAvailableColors ? [GREEN, RED] : [];
  const lightConfig = new Map<number, Color>();
  if (includeLightConfig) {
    lightConfig.set(1, GREEN);
    lightConfig.set(0, RED);
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
  return createInput(
    seedNumber,
    'pitchbend',
    'continuous',
    'xy',
    [],
    new Map()
  );
}

function createSliderInput(seedNumber: Channel = 0) {
  return createInput(seedNumber, 'controlchange', 'continuous', 'slider');
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
  expect(group.colorForState(0)).toBe(null);
});

test('colorForState returns default for unset light config', () => {
  const pad1 = createGatePadInput(0, true);
  const group = new InputGroup([pad1]);

  const correct = new ColorImpl(GREEN, pad1.number, pad1.channel);

  expect(group.colorForState(1)).toEqual(correct);
});

test('colorForState returns the correct color', () => {
  const pad1 = createGatePadInput(0, true, true);
  const group = new InputGroup([pad1]);

  const correct = new ColorImpl(RED, pad1.number, pad1.channel);

  expect(group.colorForState(0)).toEqual(correct);
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
  expect(group.eligibleEventTypes).toEqual(eligibleEventTypes);
});

test('eligibleEventTypes returns correct eventTypes for different inputs', () => {
  const gate = createGatePadInput(0);
  const slider = createSliderInput(1);
  const group = new InputGroup([gate, slider]);
  expect(group.eligibleEventTypes.length).toBe(0);
});
