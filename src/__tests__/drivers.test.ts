/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';

import { TESTABLES, DRIVERS } from '../main/drivers';
import { validateDeviceDriver } from '../helper/driver-validator';

const fNameRegex = new RegExp(/^.+\.json$/);
const getAvailableDrivers: () => string[] = TESTABLES.get(
  'getAvailableDrivers'
)!;

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

test('validate drivers', () => {
  DRIVERS.forEach((v) => {
    expect(() => {
      try {
        validateDeviceDriver(v);
      } catch (e: unknown) {
        let msg;

        if (typeof e === 'string') msg = e;
        else if (e instanceof Error) msg = e.message;
        else msg = 'unknown error';

        throw new Error(`${v.name}: ${msg}`);
      }
    }).not.toThrow();
  });
});
