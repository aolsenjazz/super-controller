import { NullPropagator } from '@shared/propagators/null-propagator';

test('constructor sets properties correctly', () => {
  const hardwareResponse = 'gate';
  const outputResponse = 'gate';
  const prop = new NullPropagator(hardwareResponse, outputResponse);

  expect(prop.hardwareResponse).toBe(hardwareResponse);
  expect(prop.outputResponse).toBe(outputResponse);
});

test('getResponse returns null', () => {
  const hardwareResponse = 'gate';
  const outputResponse = 'gate';
  const prop = new NullPropagator(hardwareResponse, outputResponse);
  expect(prop.handleMessage([128, 0, 0])).toBe(null);
});
