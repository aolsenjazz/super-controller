/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { test, expect, jest } from '@jest/globals';

import { parse, stringify } from '@shared/util';
import { ThreeByteMidiArray } from '@shared/midi-array';
import { SupportedDeviceConfig } from '@shared/hardware-config';
import {
  MonoInputConfig,
  PadConfig,
  SliderConfig,
} from '@shared/hardware-config/input-config';
import { GatePropagator, ContinuousPropagator } from '@shared/propagators';

function BasicInputConfig() {
  const d = {
    channel: 0 as Channel,
    statusString: 'controlchange' as const,
    number: 0 as MidiNumber,
    response: 'gate' as const,
  };

  const prop = new GatePropagator(
    d.response,
    d.statusString,
    d.number,
    d.channel
  );

  return new PadConfig(d, [], [], prop);
}

function BasicSupportedDevice() {
  const name = 'SomeName';
  const shareSustain: string[] = [];
  const inputConfigs: PadConfig[] = [];
  const nickname = 'SomeNickname';

  inputConfigs.push(BasicInputConfig());

  return new SupportedDeviceConfig(
    name,
    name,
    0,
    shareSustain,
    inputConfigs,
    nickname
  );
}

test('getInput throws for bad id', () => {
  const d = {
    channel: 0 as Channel,
    statusString: 'controlchange' as const,
    number: 0 as MidiNumber,
    response: 'continuous' as const,
  };

  const name = 'SomeName';
  const shareSustain: string[] = [];
  const nickname = 'SomeNickname';

  const prop = new ContinuousPropagator(
    d.response,
    d.statusString,
    d.number,
    d.channel
  );

  const input = new PadConfig(d, [], [], prop);

  const config = new SupportedDeviceConfig(
    name,
    name,
    0,
    shareSustain,
    [input],
    nickname
  );

  expect(config.getInput('badid!')).toBe(undefined);
});

test('getInput returns correct input for id', () => {
  const d = {
    channel: 0 as Channel,
    statusString: 'controlchange' as const,
    number: 0 as MidiNumber,
    response: 'continuous' as const,
  };

  const name = 'SomeName';
  const shareSustain: string[] = [];
  const inputConfigs = [];
  const nickname = 'SomeNickname';

  const prop = new ContinuousPropagator(
    d.response,
    d.statusString,
    d.number,
    d.channel
  );

  const input = new SliderConfig(d, prop);

  inputConfigs.push(input);

  const config = new SupportedDeviceConfig(
    name,
    name,
    0,
    shareSustain,
    inputConfigs,
    nickname
  );

  const result = config.getInput(input.id);
  expect(result!.id).toBe(input.id);
});

test('handleMessage() passes to correct input for processing', () => {
  const d = {
    channel: 0 as Channel,
    statusString: 'controlchange' as const,
    number: 0 as MidiNumber,
    response: 'continuous' as const,
  };

  const name = 'SomeName';
  const shareSustain: string[] = [];
  const inputConfigs = [];
  const nickname = 'SomeNickname';

  const prop = new ContinuousPropagator(
    d.response,
    d.statusString,
    d.number,
    d.channel
  );

  const input = new SliderConfig(d, prop);
  const spy = jest.spyOn(input, 'handleMessage');
  inputConfigs.push(input);

  const config = new SupportedDeviceConfig(
    name,
    name,
    0,
    shareSustain,
    inputConfigs,
    nickname
  );

  const mm = ThreeByteMidiArray.create(
    input.statusString as 'controlchange',
    input.channel,
    input.number,
    127
  );
  config.applyOverrides(mm);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('bindingAvailable returns false if binding is taken', () => {
  const device = BasicSupportedDevice();
  const input = device.inputs[0] as MonoInputConfig;
  input.number = 43;
  const result = device.bindingAvailable(input.statusString, 43, input.channel);
  expect(result).toBe(false);
});

test('bindingAvailable return true if binding is not taken', () => {
  const device = BasicSupportedDevice();
  const result = device.bindingAvailable('noteon', 42, 0);
  expect(result).toBe(true);
});

test('handleMessage just propagates msgs when no matching inputConfig found', () => {
  const device = BasicSupportedDevice();
  const msg = ThreeByteMidiArray.create(144, 0, 42, 127);
  const result = device.applyOverrides(msg);
  expect(result).toStrictEqual(msg);
});

test('toJSON and fromParsedJSON correctly serializes + deserializes', () => {
  const conf = BasicSupportedDevice();
  const json = stringify(conf);
  const other = parse<SupportedDeviceConfig>(json);

  expect(conf.id).toBe(other.id);
  expect(conf.portName).toBe(other.portName);
  expect(conf.driverName).toBe(other.driverName);
  expect(conf.siblingIndex).toBe(other.siblingIndex);
  expect(conf.nickname).toBe(other.nickname);
  expect(conf.supported).toBe(other.supported);
  expect(conf.shareSustain).toEqual(other.shareSustain);
  expect(conf.keyboardDriver).toEqual(other.keyboardDriver);
  expect(JSON.stringify(conf.inputs)).toBe(JSON.stringify(other.inputs));
});
