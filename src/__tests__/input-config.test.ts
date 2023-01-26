/* eslint @typescript-eslint/prefer-as-const: 0 */
/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { Channel, setStatus } from '@shared/midi-util';
import { InputConfig } from '@shared/hardware-config';
import { Color } from '@shared/driver-types';

import { DRIVERS } from '../main/drivers';

const RED: Color = {
  name: 'Red',
  eventType: 'noteon',
  value: 6,
  default: false,
  string: 'red',
  fx: [],
};

const GREEN: Color = {
  name: 'Green',
  eventType: 'noteon',
  value: 8,
  default: true,
  string: 'green',
  fx: [],
};

function BasicMidiMsg() {
  return setStatus([0, 60, 127], 'noteon');
}

function BasicGateInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();
  const availColors = [GREEN, RED];
  lightConfig.set('on', GREEN);

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'noteon/noteoff' as const,
    number: 0,
    response: 'gate' as 'gate',
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'controlchange' as const,
    number: 1,
    nickname: 'AYOO',
    response: 'toggle' as const,
  };

  const msg = BasicMidiMsg();
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
    eventType: 'noteon/noteoff' as const,
    number: 0,
    response: 'toggle' as const,
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'controlchange' as const,
    number: 1,
    nickname: 'AYOO',
    response: 'constant' as const,
  };

  const msg = BasicMidiMsg();
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
    eventType: 'programchange' as const,
    number: 0,
    response: 'constant' as const,
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'controlchange' as const,
    number: 1,
    nickname: 'AYOO',
    response: 'toggle' as const,
  };

  const msg = BasicMidiMsg();
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

function BasicContinuousInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'controlchange' as const,
    number: 0,
    response: 'continuous' as const,
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'programchange' as const,
    number: 1,
    nickname: 'AYOO',
    response: 'constant' as const,
  };

  const msg = BasicMidiMsg();
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

function BasicPitchbendInputConfig() {
  const overrideable = true;
  const type = 'slider';
  const lightConfig = new Map<string, Color>();

  const inputDefault = {
    channel: 0 as Channel,
    eventType: 'pitchbend' as const,
    number: 0,
    response: 'continuous' as const,
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'programchange' as const,
    number: 1,
    nickname: 'AYOO',
    response: 'constant' as const,
  };

  const msg = BasicMidiMsg();
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
    eventType: 'controlchange' as const,
    number: 0,
    response: 'continuous' as const,
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
    eventType: 'controlchange' as const,
    number: 0,
    response: 'continuous' as const,
  };

  const override = {
    lightConfig,
    channel: 1 as Channel,
    eventType: 'noteon/noteoff' as const,
    number: 1,
    nickname: 'AYOO',
    response: 'continuous' as const,
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

test('setColorForState does nothing with continuous InputConfig', () => {
  const config = BasicContinuousInputConfig();
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

test('eligibleResponses are correct for continuous InputConfig', () => {
  const config = BasicContinuousInputConfig();
  expect(config.eligibleResponses).toStrictEqual(['continuous']);
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

test('eligibleEventTypes are correct for continuous InputConfig', () => {
  const config = BasicContinuousInputConfig();
  config.response = 'continuous';
  expect(config.eligibleEventTypes).toStrictEqual([
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ]);
});

test('eligibleEventTypes are correct for pitchbend', () => {
  const config = BasicPitchbendInputConfig();
  config.response = 'continuous';
  expect(config.eligibleEventTypes).toStrictEqual([
    'pitchbend',
    'noteon',
    'noteoff',
    'controlchange',
    'programchange',
  ]);
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
  const config = BasicContinuousInputConfig();
  expect(config.defaultColor).toStrictEqual(undefined);
});

test('setLightResponse(`gate`) for toggle InputConfig throws', () => {
  const config = BasicToggleInputConfig();
  expect(() => {
    config.lightResponse = 'gate';
  }).toThrow();
});

test('setLightConfig() for continuous InputConfig throws', () => {
  const config = BasicContinuousInputConfig();
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

test('currentColor returns undefined for continuous InputConfig', () => {
  const config = BasicContinuousInputConfig();
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

test('eligibleLightResponses are empty for continuous InputConfig', () => {
  const config = BasicContinuousInputConfig();
  expect(config.eligibleLightResponses).toStrictEqual([]);
});
