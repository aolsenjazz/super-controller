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

function BasicMidiMsg() {
  return new MidiMessage('noteon', 60, 127, 0, 0);
}

function BasicGateInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();
  const availColors = [GREEN, RED];
  lightConfig.set('on', GREEN);

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as EventType,
    number: 0 as MidiValue,
    response: 'gate' as 'gate',
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'controlchange' as EventType,
    number: 1 as MidiValue,
    nickname: 'AYOO',
    response: 'toggle' as 'toggle',
  };

  const msg = BasicMidiMsg().toMidiArray();
  const config = new InputConfig(
    inputDefault,
    override,
    availColors,
    overrideable,
    type
  );

  config.handleMessage(msg);

  return config;
}

function BasicToggleInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();
  const availColors = [GREEN, RED];
  lightConfig.set('on', GREEN);

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as EventType,
    number: 0 as MidiValue,
    response: 'toggle' as 'toggle',
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'controlchange' as EventType,
    number: 1 as MidiValue,
    nickname: 'AYOO',
    response: 'constant' as 'constant',
  };

  const msg = BasicMidiMsg().toMidiArray();
  const config = new InputConfig(
    inputDefault,
    override,
    availColors,
    overrideable,
    type
  );

  config.handleMessage(msg);

  return config;
}

function BasicConstantInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();
  const availColors = [GREEN, RED];
  lightConfig.set('on', GREEN);

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'programchange' as EventType,
    number: 0 as MidiValue,
    response: 'constant' as 'constant',
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'controlchange' as EventType,
    number: 1 as MidiValue,
    nickname: 'AYOO',
    response: 'toggle' as 'toggle',
  };

  const msg = BasicMidiMsg().toMidiArray();
  const config = new InputConfig(
    inputDefault,
    override,
    availColors,
    overrideable,
    type
  );

  config.handleMessage(msg);

  return config;
}

function BasicLinearInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'controlchange' as EventType,
    number: 0 as MidiValue,
    response: 'linear' as 'linear',
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'programchange' as EventType,
    number: 1 as MidiValue,
    nickname: 'AYOO',
    response: 'constant' as 'constant',
  };

  const msg = BasicMidiMsg().toMidiArray();
  const config = new InputConfig(
    inputDefault,
    override,
    [],
    overrideable,
    type
  );

  config.handleMessage(msg);

  return config;
}

test('fromJSON properly serializes inputConfig.type', () => {
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

test('toJSON and fromJSON input restores defaults', () => {
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

test('fromDriver returns a valid InputConfig', () => {
  const driver = DRIVERS.get('APC Key 25');
  const result = InputConfig.fromDriver(driver!.inputGrids[0].inputs[0]);

  expect(result.number).toBe(32);
});

test('toJSON + fromJSON correctly set outputProps lastPropagated', () => {
  const config = BasicGateInputConfig();
  const lastProp = config.outputPropagator.lastPropagated;

  const json = config.toJSON(true);

  const config2 = InputConfig.fromJSON(json);
  const result = config2.outputPropagator.lastPropagated;

  expect(result).toStrictEqual(lastProp);
});

test('setColorForState does nothing with linear InputConfig', () => {
  const config = BasicLinearInputConfig();
  config.setColorForState('on', RED);
  expect(config.colorForState('on')).toBe(undefined);
});

test('setColorForState and colorForState set + get respectively', () => {
  const config = BasicGateInputConfig();
  config.setColorForState('off', GREEN);
  expect(config.colorForState('off')).toStrictEqual(GREEN);
});

test('setColorForState correctly sets for `on` state', () => {
  const config = BasicGateInputConfig();
  config.setColorForState('on', RED);
  expect(config.colorForState('on')).toStrictEqual(RED);
});

test('restoreDefaults restores number, eventType, channel, response', () => {
  const config = BasicGateInputConfig();
  config.restoreDefaults();
  expect(config.response).toBe(config.default.response);
  expect(config.channel).toBe(config.default.channel);
  expect(config.eventType).toBe(config.default.eventType);
  expect(config.number).toBe(config.default.number);
});

test('eligibleResponses are correct for gate InputConfig', () => {
  const config = BasicGateInputConfig();
  expect(config.eligibleResponses).toStrictEqual([
    'gate',
    'toggle',
    'constant',
  ]);
});

test('eligibleResponses are correct for toggle InputConfig', () => {
  const config = BasicToggleInputConfig();
  expect(config.eligibleResponses).toStrictEqual(['toggle', 'constant']);
});

test('eligibleResponses are correct for constant InputConfig and controlchange eventType', () => {
  const config = BasicConstantInputConfig();
  expect(config.eligibleResponses).toStrictEqual(['toggle', 'constant']);
});

test('eligibleResponses are correct for constant InputConfig and programchange eventType', () => {
  const config = BasicConstantInputConfig();
  config.eventType = 'programchange';
  expect(config.eligibleResponses).toStrictEqual(['constant']);
});

test('eligibleResponses are correct for linear InputConfig', () => {
  const config = BasicLinearInputConfig();
  expect(config.eligibleResponses).toStrictEqual(['linear']);
});

test('eligibleEventTypes are correct for constant InputConfig', () => {
  const config = BasicConstantInputConfig();
  config.response = 'constant';
  expect(config.eligibleEventTypes).toStrictEqual([
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ]);
});

test('eligibleEventTypes are correct for linear InputConfig', () => {
  const config = BasicLinearInputConfig();
  config.response = 'linear';
  expect(config.eligibleEventTypes).toStrictEqual([
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ]);
});

test('eligibleEventTypes are correct for pitchbend', () => {
  const config = BasicLinearInputConfig();
  config.response = 'linear';
  config.eventType = 'pitchbend';
  expect(config.eligibleEventTypes).toStrictEqual(['pitchbend']);
});

test('eligibleEventTypes are correct for gate InputConfig', () => {
  const config = BasicGateInputConfig();
  config.response = 'gate';
  expect(config.eligibleEventTypes).toStrictEqual([
    'noteon/noteoff',
    'controlchange',
    'programchange',
  ]);
});

test('defaultColor returns correct val', () => {
  const config = BasicGateInputConfig();
  expect(config.defaultColor).toStrictEqual(GREEN);
});

test('defaultColor returns undefined for empty availableColors list', () => {
  const config = BasicLinearInputConfig();
  expect(config.defaultColor).toStrictEqual(undefined);
});

test('setLightResponse(`gate`) for toggle InputConfig throws', () => {
  const config = BasicToggleInputConfig();
  expect(() => {
    config.lightResponse = 'gate';
  }).toThrow();
});

test('setLightConfig() for linear InputConfig throws', () => {
  const config = BasicLinearInputConfig();
  expect(() => {
    config.lightResponse = 'toggle';
  }).toThrow();
});

test('setLightConfig(`toggle`) for gate InputConfig works', () => {
  const config = BasicGateInputConfig();
  config.lightResponse = 'toggle';
  expect(config.lightResponse).toBe('toggle');
});

test('setValue/getValue work', () => {
  const config = BasicConstantInputConfig();
  config.value = 42;
  expect(config.value).toBe(42);
});

test('currentColor returns undefined for linear InputConfig', () => {
  const config = BasicLinearInputConfig();
  expect(config.currentColor).toBe(undefined);
});

test('setting response to constant while in noteon/noteoff mode sets eventType to `noteon`', () => {
  const config = BasicConstantInputConfig();
  config.eventType = 'noteon/noteoff';
  config.response = 'constant';
  expect(config.eventType).toBe('noteon');
});

test('eligibleLightResponses are correct for constant input', () => {
  const config = BasicConstantInputConfig();
  expect(config.eligibleLightResponses).toStrictEqual(['gate', 'toggle']);
});

test('eligibleLightResponses are correct for gate InputConfig', () => {
  const config = BasicGateInputConfig();
  expect(config.eligibleLightResponses).toStrictEqual(['gate', 'toggle']);
});

test('eligibleLightResponses are correct for toggle InputConfig', () => {
  const config = BasicToggleInputConfig();
  expect(config.eligibleLightResponses).toStrictEqual(['toggle']);
});

test('eligibleLightResponses are empty for linear InputConfig', () => {
  const config = BasicLinearInputConfig();
  expect(config.eligibleLightResponses).toStrictEqual([]);
});

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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

// TODO: this belonds in a propagator test class
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
