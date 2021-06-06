import { test, expect } from '@jest/globals';

import { UnsupportedDeviceConfig } from '../hardware-config';

test('new UnsupportedDevice() correctly assigns values', () => {
  const id = 'BIGID';
  const name = 'littlename';
  const device = new UnsupportedDeviceConfig(id, name, 0);

  expect(device.id).toBe(id);
  expect(device.name).toBe(name);
});
