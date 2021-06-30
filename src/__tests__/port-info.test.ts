import { test, expect } from '@jest/globals';
import { PortInfo } from '../ports/port-info';

test('constructing a PortInfo set all values correctly', () => {
  const name = 'name';
  const id = 'id';
  const occurNum = 42;
  const connected = true;

  const pi = new PortInfo(id, name, occurNum, connected);

  expect(pi.name).toBe(name);
  expect(pi.id).toBe(id);
  expect(pi.occurrenceNumber).toBe(occurNum);
  expect(pi.connected).toBe(connected);
});
