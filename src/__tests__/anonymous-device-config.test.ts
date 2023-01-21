/* eslint @typescript-eslint/no-non-null-assertion: 0 */
import { test, expect } from '@jest/globals';
import { AnonymousDeviceConfig } from '@shared/hardware-config';
import { getStatus, getChannel } from '@shared/midi-util';

test('new UnsupportedDevice() correctly assigns values', () => {
  const name = 'littlename';
  const siblingIndex = 7;
  const nickname = 'nick';
  const overrides = new Map<string, number[]>();
  overrides.set('someKey', [144, 0, 0]);

  const device = new AnonymousDeviceConfig(
    name,
    siblingIndex,
    overrides,
    [],
    nickname
  );

  expect(device.id).toBe(`${name} ${siblingIndex}`);
  expect(device.name).toBe(name);
  expect(device.siblingIndex).toBe(siblingIndex);
  expect(device.nickname).toBe(nickname);
  expect(Array.from(device.overrides.entries())).toEqual(
    Array.from(overrides.entries())
  );
});

test('toJSON and fromJSON correctly serializes and deserializes', () => {
  const name = 'littlename';
  const siblingIndex = 7;
  const nickname = 'nick';
  const overrides = new Map<string, number[]>();
  const shareWith = ['otherDevice'];

  overrides.set('someKey', [144, 0, 0]);
  const device = new AnonymousDeviceConfig(
    name,
    siblingIndex,
    overrides,
    shareWith,
    nickname
  );
  const json = device.toJSON();
  const obj = JSON.parse(json);
  const other = AnonymousDeviceConfig.fromParsedJSON(obj);

  expect(device.id).toBe(other.id);
  expect(device.name).toBe(other.name);
  expect(device.siblingIndex).toBe(other.siblingIndex);
  expect(device.nickname).toBe(other.nickname);
  expect(device.supported).toBe(other.supported);
  expect(device.shareSustain).toEqual(other.shareSustain);
  expect(Array.from(device.overrides.entries())).toEqual(
    Array.from(other.overrides.entries())
  );
});

test('handleMessage propagates message when not-overridden', () => {
  const name = 'littlename';
  const nickname = 'nick';

  const device = new AnonymousDeviceConfig(name, 7, new Map(), [], nickname);
  const msg = [144, 0, 0];
  /* eslint-disable-next-line */
  const [_toDevice, toPropagate] = device.handleMessage(msg);
  expect(toPropagate).toEqual(msg);
});

test('handleMessage returns null message to prop to device', () => {
  const name = 'littlename';
  const nickname = 'nick';

  const device = new AnonymousDeviceConfig(name, 7, new Map(), [], nickname);
  const msg = [144, 0, 0];
  /* eslint-disable-next-line */
  const [toDevice, _toPropagate] = device.handleMessage(msg);
  expect(toDevice).toBe(null);
});

test('handleMessage applies override', () => {
  const msg = [128, 127, 127];

  const override = [144, 100, 100];
  const status = getStatus(override);
  const channel = getChannel(override);

  const name = 'littlename';
  const nickname = 'nick';
  const overrides = new Map<string, number[]>();
  const device = new AnonymousDeviceConfig(name, 7, overrides, [], nickname);
  device.overrideInput(msg, status.string, channel, override[2]);
  /* eslint-disable-next-line */
  const [_toDevice, toPropagate] = device.handleMessage(msg);
  expect(toPropagate![0]).toEqual(override[0]);
  expect(toPropagate![1]).toEqual(override[1]);
});
