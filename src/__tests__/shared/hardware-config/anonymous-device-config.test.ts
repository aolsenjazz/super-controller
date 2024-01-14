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

  const device = new AnonymousDeviceConfig(name, siblingIndex, nickname);

  expect(device.id).toBe(`${name} ${siblingIndex}`);
  expect(device.portName).toBe(name);
  expect(device.siblingIndex).toBe(siblingIndex);
  expect(device.nickname).toBe(nickname);
});

test('toJSON and fromJSON correctly serializes and deserializes', () => {
  const name = 'littlename';
  const siblingIndex = 7;
  const overrides = new Map<string, ThreeByteMidiArray>();

  overrides.set('someKey', ThreeByteMidiArray.create(144, 0, 0, 0));
  const device = new AnonymousDeviceConfig(name, siblingIndex);
  const json = stringify(device);
  const other = parse<AnonymousDeviceConfig>(json);

  expect(device.id).toBe(other.id);
  expect(device.driverName).toBe(other.driverName);
  expect(device.siblingIndex).toBe(other.siblingIndex);
  expect(device.nickname).toBe(other.nickname);
});

test('handleMessage propagates message when not-overridden', () => {
  const name = 'littlename';
  const nickname = 'nick';

  const device = new AnonymousDeviceConfig(name, 7, nickname);
  const msg = ThreeByteMidiArray.create(144, 0, 0, 0);

  /* eslint-disable-next-line */
  const toPropagate = device.applyOverrides(msg);
  expect(toPropagate).toEqual(msg);
});
