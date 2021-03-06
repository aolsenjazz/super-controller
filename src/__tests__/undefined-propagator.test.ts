import { UndefinedPropagator } from '@shared/propagators/undefined-propagator';

test('constructor sets properties correctly', () => {
  const hardwareResponse = 'gate';
  const outputResponse = 'gate';
  const prop = new UndefinedPropagator(hardwareResponse, outputResponse);

  expect(prop.hardwareResponse).toBe(hardwareResponse);
  expect(prop.outputResponse).toBe(outputResponse);
});

test('getResponse returns null', () => {
  const hardwareResponse = 'gate';
  const outputResponse = 'gate';
  const prop = new UndefinedPropagator(hardwareResponse, outputResponse);
  expect(prop.handleMessage([128, 0, 0])).toBe(undefined);
});
