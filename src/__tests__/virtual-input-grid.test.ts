/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';
import { VirtualInputGrid } from '../renderer/virtual-devices';
import { DRIVERS } from '../main/drivers';

test('constructing VirtualInputGrid set values correctly', () => {
  const deviceDriver = DRIVERS.get('APC Key 25');
  const gridDriver = deviceDriver!.inputGrids[0];

  const vid = new VirtualInputGrid(gridDriver);

  expect(vid.id).toBe(gridDriver.id);
  expect(vid.width).toBe(gridDriver.width);
  expect(vid.height).toBe(gridDriver.height);
  expect(vid.nRows).toBe(gridDriver.nRows);
  expect(vid.nCols).toBe(gridDriver.nCols);
  expect(vid.left).toBe(gridDriver.left);
  expect(vid.bottom).toBe(gridDriver.bottom);
});

test('isMultiInput returns false when its supposed to', () => {
  const deviceDriver = DRIVERS.get('APC Key 25');
  const gridDriver = deviceDriver!.inputGrids[0];

  const vid = new VirtualInputGrid(gridDriver);

  expect(vid.isMultiInput).toBe(false);
});
