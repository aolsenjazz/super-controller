/* eslint @typescript-eslint/prefer-as-const: 0 */

import { test, expect } from '@jest/globals';
import {
  EventType,
  Channel,
  MidiValue,
  MidiMessage,
} from 'midi-message-parser';

import { InputConfig } from '../hardware-config';
import { Color } from '../driver-types';

import { DRIVERS } from '../drivers';

const RED: Color = {
  name: 'Red',
  eventType: 'noteon',
  value: 6,
  default: false,
  string: 'red',
};

const GREEN: Color = {
  name: 'Green',
  eventType: 'noteon',
  value: 8,
  default: true,
  string: 'green',
};

test('createInput returns knob config for parsed JSON', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'controlchange' as EventType,
    number: 0 as MidiValue,
    response: 'linear' as 'linear' | 'toggle',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
  };
  const overrideable = true;
  const type = 'knob';

  const conf = new InputConfig(inputDefault, override, [], overrideable, type);
  const json = conf.toJSON(false);
  const result = InputConfig.fromJSON(json);

  expect(result.type).toBe('knob');
});

test('createInput returns wheel config for parsed PitchbendInputConfig JSON', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'controlchange' as EventType,
    number: 0 as MidiValue,
    response: 'linear' as 'linear' | 'toggle',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
  };
  const overrideable = true;
  const type = 'wheel';

  const conf = new InputConfig(inputDefault, override, [], overrideable, type);
  const json = conf.toJSON(false);
  const result = InputConfig.fromJSON(json);

  expect(result.type).toBe('wheel');
});

test('createInput works for driver', () => {
  const driver = DRIVERS.get('APC Key 25');
  const result = InputConfig.fromDriver(driver!.inputGrids[0].inputs[0]);

  expect(result.number).toBe(32);
});

test('serial+deserializing input restores defaults', () => {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();
  const availColors = [GREEN, RED];
  lightConfig.set('on', GREEN);

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'controlchange' as EventType,
    number: 0 as MidiValue,
    response: 'linear' as 'linear' | 'toggle',
  };

  const linear: 'linear' = 'linear';
  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'noteon/noteoff' as EventType,
    number: 1 as MidiValue,
    nickname: 'AYOO',
    response: linear,
  };

  const conf = new InputConfig(
    inputDefault,
    override,
    availColors,
    overrideable,
    type
  );

  const json = conf.toJSON(true);
  const result = InputConfig.fromJSON(json);

  expect(result.default).toStrictEqual(inputDefault);
  expect(result.override).toStrictEqual(override);
  expect(result.availableColors).toStrictEqual(availColors);
  expect(result.overrideable).toBe(overrideable);
  expect(result.type).toBe(type);
});

test('gate->gate handleMessage returns correct toPropagate msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'gate' as 'gate',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
  };
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(inputDefault, override, [], overrideable, type);

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  const res1 = new MidiMessage(msgs1[1]!, 0);
  expect(res1.value).toBe(127);
  expect(res1.type).toBe('noteon');

  const mm2 = new MidiMessage('noteoff', 60, 127, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  const res2 = new MidiMessage(msgs2[1]!, 0);
  expect(res2.value).toBe(0);
  expect(res2.type).toBe('noteoff');

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  const res3 = new MidiMessage(msgs3[1]!, 0);
  expect(res3.value).toBe(127);
  expect(res3.type).toBe('noteon');
});

test('gate->toggle handleMessage return correct toPropagate msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'gate' as 'gate',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
    response: 'toggle' as 'toggle',
  };
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(inputDefault, override, [], overrideable, type);

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  const res1 = new MidiMessage(msgs1[1]!, 0);
  expect(res1.value).toBe(127);
  expect(res1.type).toBe('noteon');

  const mm2 = new MidiMessage('noteoff', 60, 0, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  expect(msgs2[1]).toBe(null);

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  const res3 = new MidiMessage(msgs3[1]!, 0);
  expect(res3.value).toBe(0);
  expect(res3.type).toBe('noteoff');

  const mm4 = new MidiMessage('noteoff', 60, 0, 0, 0);
  const msgs4 = conf.handleMessage(mm4.toMidiArray());
  expect(msgs4[1]).toBe(null);

  const mm5 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs5 = conf.handleMessage(mm5.toMidiArray());
  const res5 = new MidiMessage(msgs5[1]!, 0);
  expect(res5.value).toBe(127);
  expect(res5.type).toBe('noteon');
});

test('toggle->toggle handleMessage returns correct toPropagate msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'toggle' as 'toggle',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
  };
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(inputDefault, override, [], overrideable, type);

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  const res1 = new MidiMessage(msgs1[1]!, 0);
  expect(res1.value).toBe(127);
  expect(res1.type).toBe('noteon');

  const mm2 = new MidiMessage('noteoff', 60, 0, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  const res2 = new MidiMessage(msgs2[1]!, 0);
  expect(res2.value).toBe(0);
  expect(res2.type).toBe('noteoff');

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  const res3 = new MidiMessage(msgs3[1]!, 0);
  expect(res3.value).toBe(127);
  expect(res3.type).toBe('noteon');
});

test('gate->constant handleMessage returns correct toPropagate msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'gate' as 'gate',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
    eventType: 'noteon' as EventType,
    response: 'constant' as 'constant',
  };
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(
    inputDefault,
    override,
    [],
    overrideable,
    type,
    69
  );

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  const res1 = new MidiMessage(msgs1[1]!, 0);
  expect(res1.value).toBe(69);
  expect(res1.type).toBe('noteon');

  const mm2 = new MidiMessage('noteoff', 60, 0, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  expect(msgs2[1]).toBe(null);

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  const res3 = new MidiMessage(msgs3[1]!, 0);
  expect(res3.value).toBe(69);
  expect(res3.type).toBe('noteon');
});

test('toggle->constant handleMessage returns correct toPropagate msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'toggle' as 'toggle',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
    eventType: 'noteon' as EventType,
    response: 'constant' as 'constant',
  };
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(
    inputDefault,
    override,
    [],
    overrideable,
    type,
    69
  );

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  const res1 = new MidiMessage(msgs1[1]!, 0);
  expect(res1.value).toBe(69);
  expect(res1.type).toBe('noteon');

  const mm2 = new MidiMessage('noteoff', 60, 0, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  const res2 = new MidiMessage(msgs2[1]!, 0);
  expect(res2.value).toBe(69);
  expect(res2.type).toBe('noteon');

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  const res3 = new MidiMessage(msgs3[1]!, 0);
  expect(res3.value).toBe(69);
  expect(res3.type).toBe('noteon');
});

test('setting response to constant auto-sets propagator.value', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'toggle' as 'toggle',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
    eventType: 'noteon' as EventType,
    response: 'toggle' as 'toggle',
  };
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(inputDefault, override, [], overrideable, type);
  conf.response = 'constant';

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs = conf.handleMessage(mm1.toMidiArray());
  const res1 = new MidiMessage(msgs[1]!, 0);
  expect(res1.value).toBe(127);
});

test('gate->gate handleMessage returns correct toDevice msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'gate' as 'gate',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
  };
  override.lightConfig.set('on', GREEN);
  override.lightConfig.set('off', RED);
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(
    inputDefault,
    override,
    [GREEN, RED],
    overrideable,
    type
  );

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  expect(msgs1[0]![2]).toBe(GREEN.value);

  const mm2 = new MidiMessage('noteoff', 60, 127, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  expect(msgs2[0]![2]).toBe(RED.value);

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  expect(msgs3[0]![2]).toBe(GREEN.value);
});

test('gate->toggle handleMessage returns correct toDevice msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'gate' as 'gate',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
    response: 'toggle' as 'toggle',
  };
  override.lightConfig.set('on', GREEN);
  override.lightConfig.set('off', RED);
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(
    inputDefault,
    override,
    [GREEN, RED],
    overrideable,
    type
  );

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  expect(msgs1[0]![2]).toBe(GREEN.value);

  const mm2 = new MidiMessage('noteoff', 60, 127, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  expect(msgs2[0]).toBe(null);

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  expect(msgs3[0]![2]).toBe(RED.value);
});

test('toggle->toggle handleMessage returns correct toDevice msg', () => {
  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as 'noteon/noteoff',
    number: 0 as MidiValue,
    response: 'toggle' as 'toggle',
  };
  const override = {
    lightConfig: new Map<string, Color>(),
    response: 'toggle' as 'toggle',
  };
  override.lightConfig.set('on', GREEN);
  override.lightConfig.set('off', RED);
  const overrideable = true;
  const type = 'pad';

  const conf = new InputConfig(
    inputDefault,
    override,
    [GREEN, RED],
    overrideable,
    type
  );

  const mm1 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs1 = conf.handleMessage(mm1.toMidiArray());
  expect(msgs1[0]![2]).toBe(GREEN.value);

  const mm2 = new MidiMessage('noteoff', 60, 127, 0, 0);
  const msgs2 = conf.handleMessage(mm2.toMidiArray());
  expect(msgs2[0]![2]).toBe(RED.value);

  const mm3 = new MidiMessage('noteon', 60, 127, 0, 0);
  const msgs3 = conf.handleMessage(mm3.toMidiArray());
  expect(msgs3[0]![2]).toBe(GREEN.value);
});
