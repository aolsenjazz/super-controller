import { test, expect } from '@jest/globals';
import { AnonymousDeviceConfig } from '@shared/hardware-config/anonymous-device-config';

test('new UnsupportedDevice() correctly assigns values', () => {
  const name = 'littlename';
  const siblingIndex = 7;
  const nickname = 'nick';
  const overrides = new Map<string, NumberArrayWithStatus>();
  overrides.set('someKey', [144, 0, 0] as NumberArrayWithStatus); // Manually building the MIDI array

  const device = new AnonymousDeviceConfig(name, siblingIndex, nickname);

  expect(device.id).toBe(`${name} ${siblingIndex}`);
  expect(device.portName).toBe(name);
  expect(device.siblingIndex).toBe(siblingIndex);
  expect(device.nickname).toBe(nickname);
});

test('handleMessage propagates message when not-overridden', () => {
  const name = 'littlename';
  const nickname = 'nick';

  const device = new AnonymousDeviceConfig(name, 7, nickname);
  const msg = [144, 0, 0] as NumberArrayWithStatus;

  /* eslint-disable-next-line */
  const toPropagate = device.applyOverrides(msg);
  expect(toPropagate).toEqual(msg);
});
