/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';
import { VirtualDevice } from '../renderer/virtual-devices';
import { DRIVERS } from '../drivers';

test('constructing a VirtualDevice sets values correctly', () => {
  const driver = DRIVERS.get('APC Key 25');
  const id = 'SomeID';
  const vd = new VirtualDevice(id, driver!);

  expect(vd.name).toBe(driver!.name);
  expect(vd.width).toBe(driver!.width);
  expect(vd.height).toBe(driver!.height);
  expect(vd.style).toStrictEqual(driver!.style);
  expect(vd.keyboard).toStrictEqual(driver!.keyboard);
});

test('aspectRatio is correct', () => {
  const driver = DRIVERS.get('APC Key 25');
  const id = 'SomeID';
  const vd = new VirtualDevice(id, driver!);

  const correct = vd.width / vd.height;
  expect(vd.aspectRatio).toBe(correct);
});
