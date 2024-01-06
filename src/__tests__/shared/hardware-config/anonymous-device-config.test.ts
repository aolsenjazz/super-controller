/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { test, expect } from '@jest/globals';

import { ThreeByteMidiArray } from '@shared/midi-array';
import { parse, stringify } from '@shared/util';
import { AnonymousDeviceConfig } from '@shared/hardware-config';

test('new UnsupportedDevice() correctly assigns values', () => {
  const name = 'littlename';
  const siblingIndex = 7;
  const nickname = 'nick';
  const overrides = new Map<string, ThreeByteMidiArray>();
  overrides.set('someKey', ThreeByteMidiArray.create(144, 0, 0, 0));

  const device = new AnonymousDeviceConfig(
    name,
    siblingIndex,
    overrides,
    [],
    nickname
  );

  expect(device.id).toBe(`${name} ${siblingIndex}`);
  expect(device.portName).toBe(name);
  expect(device.siblingIndex).toBe(siblingIndex);
  expect(device.nickname).toBe(nickname);
  expect(JSON.stringify(device.overrides)).toEqual(JSON.stringify(overrides));
});

test('toJSON and fromJSON correctly serializes and deserializes', () => {
  const name = 'littlename';
  const siblingIndex = 7;
  const nickname = 'nick';
  const overrides = new Map<string, ThreeByteMidiArray>();
  const shareWith = ['otherDevice'];

  overrides.set('someKey', ThreeByteMidiArray.create(144, 0, 0, 0));
  const device = new AnonymousDeviceConfig(
    name,
    siblingIndex,
    overrides,
    shareWith,
    nickname
  );
  const json = stringify(device);
  const other = parse<AnonymousDeviceConfig>(json);

  expect(device.id).toBe(other.id);
  expect(device.driverName).toBe(other.driverName);
  expect(device.siblingIndex).toBe(other.siblingIndex);
  expect(device.nickname).toBe(other.nickname);
  expect(device.shareSustain).toEqual(other.shareSustain);
  expect(JSON.stringify(device.overrides)).toEqual(
    JSON.stringify(other.overrides)
  );
});

test('handleMessage propagates message when not-overridden', () => {
  const name = 'littlename';
  const nickname = 'nick';

  const device = new AnonymousDeviceConfig(name, 7, new Map(), [], nickname);
  const msg = ThreeByteMidiArray.create(144, 0, 0, 0);

  /* eslint-disable-next-line */
  const toPropagate = device.applyOverrides(msg);
  expect(toPropagate).toEqual(msg);
});

test('handleMessage applies override', () => {
  const msg = ThreeByteMidiArray.create(128, 0, 127, 127);

  const override = ThreeByteMidiArray.create(144, 0, 100, 100);
  const { status, channel } = override;

  const name = 'littlename';
  const nickname = 'nick';
  const overrides = new Map<string, ThreeByteMidiArray>();
  const device = new AnonymousDeviceConfig(name, 7, overrides, [], nickname);
  device.overrideInput(msg, status, channel, override[2], 60);
  /* eslint-disable-next-line */
  const toPropagate = device.applyOverrides(msg);
  expect(toPropagate![0]).toEqual(override[0]);
  expect(toPropagate![1]).toEqual(override[1]);
});

test('serializes + deserializes correctly', () => {
  const msg = ThreeByteMidiArray.create(128, 0, 127, 127);

  const override = ThreeByteMidiArray.create(144, 0, 100, 100);
  const { status, channel } = override;
  const name = 'littlename';
  const nickname = 'nick';
  const overrides = new Map<string, ThreeByteMidiArray>();
  const device = new AnonymousDeviceConfig(name, 7, overrides, [], nickname);
  device.overrideInput(msg, status, channel, override[2], 60);

  const json = stringify(device);
  const from = parse<AnonymousDeviceConfig>(json);

  expect(stringify(from)).toEqual(stringify(device));
});
