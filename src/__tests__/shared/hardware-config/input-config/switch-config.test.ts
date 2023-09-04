import { SwitchDriver } from '@shared/driver-types';
import { SwitchConfig } from '@shared/hardware-config';
import { parse } from '@shared/util';

const DRIVER: SwitchDriver = {
  shape: 'circle',
  type: 'switch',
  interactive: true,
  height: 1,
  width: 1,
  response: 'enumerated',
  number: 0,
  channel: 0,
  status: 'controlchange',
  availableColors: [],
  availableFx: [],
  steps: [
    [144, 0, 0],
    [144, 0, 127],
  ],
  stepLabels: ['off', 'on'],
  sequential: true,
  inverted: false,
  horizontal: false,
  initialStep: 0,
};

describe('fromDriver', () => {
  test('set values correctly', () => {
    const conf = SwitchConfig.fromDriver(DRIVER);
    expect(conf.number).toBe(DRIVER.number);
    expect(conf.channel).toBe(DRIVER.channel);
  });
});

describe('toJSON', () => {
  test('de/serializes correctly', () => {
    const conf = SwitchConfig.fromDriver(DRIVER);
    conf.number = 20;
    conf.channel = 5;
    const json = JSON.stringify(conf);
    const result = parse<SwitchConfig>(json);

    expect(result.number).toBe(20);
    expect(result.response).toBe('enumerated');
    expect(result.channel).toBe(5);
  });
});
