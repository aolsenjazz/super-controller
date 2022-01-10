/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';

import { AnonymousDeviceConfig } from '@shared/hardware-config';

test('new UnsupportedDevice() correctly assigns values', () => {
  const name = 'littlename';
  const device = new AnonymousDeviceConfig(name, 0, new Map(), []);

  expect(device.id).toBe(`${name} 0`);
  expect(device.name).toBe(name);
});
