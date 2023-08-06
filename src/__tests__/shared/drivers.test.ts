/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { DRIVERS, getAvailableDrivers } from '@shared/drivers';

test('DRIVERS.get gets the correct file', () => {
  const name = 'APC Key 25';
  const driver = DRIVERS.get(name);
  expect(driver!.name).toBe(name);
});

test('loadDriver throws if bad driver name', () => {
  const name = 'BadName!!!';

  const result = DRIVERS.get(name);

  expect(result).toBe(undefined);
});

test('getAvailableDrivers returns correct list', () => {
  const list = getAvailableDrivers();
  const result = list.includes('APC Key 25');
  expect(result).toBe(true);
});
