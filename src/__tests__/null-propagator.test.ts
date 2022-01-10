import { NullPropagator } from '@shared/propagators/null-propagator';

test('constructor sets properties correctly', () => {
  const inputResponse = 'gate';
  const outputResponse = 'gate';
  const prop = new NullPropagator(inputResponse, outputResponse);

  expect(prop.inputResponse).toBe(inputResponse);
  expect(prop.outputResponse).toBe(outputResponse);
});

test('getResponse returns null', () => {
  const inputResponse = 'gate';
  const outputResponse = 'gate';
  const prop = new NullPropagator(inputResponse, outputResponse);
  expect(prop.handleMessage([128, 0, 0])).toBe(null);
});
