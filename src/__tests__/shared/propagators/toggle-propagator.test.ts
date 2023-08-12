import { TogglePropagator } from '@shared/propagators/toggle-propagator';
import { parse } from '@shared/util';

describe('toJSON', () => {
  test('de/serializes correctly', () => {
    const prop = new TogglePropagator('toggle', 'controlchange', 100, 10);
    const json = JSON.stringify(prop);
    const result = parse<TogglePropagator>(json);
    expect(JSON.stringify(prop)).toBe(JSON.stringify(result));
  });
});
