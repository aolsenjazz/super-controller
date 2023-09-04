import { InputDriverWithHandle } from '@shared/driver-types';
import { SliderConfig } from '@shared/hardware-config/input-config';
import { parse } from '@shared/util';

const DRIVER: InputDriverWithHandle = {
  shape: 'circle',
  type: 'slider',
  interactive: true,
  height: 1,
  width: 1,
  response: 'continuous',
  number: 10,
  channel: 11,
  status: 'pitchbend',
  availableColors: [],
  availableFx: [],
  inverted: false,
  horizontal: false,
  handleWidth: 0.5,
  handleHeight: 0.5,
};

describe('fromDriver', () => {
  test('set values correctly', () => {
    const conf = SliderConfig.fromDriver(DRIVER);
    expect(conf.response).toBe(DRIVER.response);
    expect(conf.number).toBe(DRIVER.number);
    expect(conf.statusString).toBe(DRIVER.status);
  });
});

describe('toJSON', () => {
  test('de/serializes correctly', () => {
    const conf = SliderConfig.fromDriver(DRIVER);
    conf.number = 20;
    conf.channel = 15;
    const json = JSON.stringify(conf);
    const result = parse<SliderConfig>(json);

    expect(result.number).toBe(20);
    expect(result.channel).toBe(15);
  });
});
