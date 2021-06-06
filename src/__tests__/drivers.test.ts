import { test, expect } from '@jest/globals';

import { getAvailableDrivers, DRIVERS } from '../drivers';

const fNameRegex = new RegExp(/^.+\.json$/);

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
  const result = list.includes('APC Key 25.json');
  expect(result).toBe(true);
});

test('getAvailableDrivers returns only json files', () => {
  const list = getAvailableDrivers();

  let allMatch = true;
  list.forEach((name) => {
    if (!fNameRegex.test(name)) allMatch = false;
  });

  expect(allMatch).toBe(true);
});
