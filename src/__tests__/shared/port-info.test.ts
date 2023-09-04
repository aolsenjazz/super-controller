import { test, expect } from '@jest/globals';
import { PortInfo } from '@shared/port-info';

test('constructing a PortInfo set all values correctly', () => {
  const name = 'name';
  const siblingIndex = 42;
  const connected = true;

  const pi = new PortInfo(name, siblingIndex, connected);

  expect(pi.name).toBe(name);
  expect(pi.id).toBe(`${name} ${siblingIndex}`);
  expect(pi.siblingIndex).toBe(siblingIndex);
  expect(pi.connected).toBe(connected);
});
