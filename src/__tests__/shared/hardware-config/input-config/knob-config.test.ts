import { KnobDriver } from '@shared/driver-types';
import { KnobConfig } from '@shared/hardware-config/input-config';
import { parse } from '@shared/util';

const DRIVER: KnobDriver = {
  shape: 'circle',
  type: 'knob',
  interactive: true,
  height: 1,
  width: 1,
  response: 'continuous',
  number: 10,
  channel: 11,
  status: 'controlchange',
  availableColors: [],
  availableFx: [],
  knobType: 'endless',
};

describe('fromDriver', () => {
  test('sets value correctly', () => {
    const conf = KnobConfig.fromDriver(DRIVER);
    expect(conf.response).toBe(DRIVER.response);
    expect(conf.number).toBe(DRIVER.number);
    expect(conf.knobType).toBe(DRIVER.knobType);
  });
});

describe('restoreDefaults', () => {
  test('restores valueType', () => {
    const conf = KnobConfig.fromDriver(DRIVER);
    conf.valueType = 'absolute';
    conf.restoreDefaults();
    expect(conf.valueType).toBe('endless');
  });
});

describe('toJSON', () => {
  test('de/serailizes values correctly', () => {
    const conf = KnobConfig.fromDriver(DRIVER);
    conf.number = 30;
    conf.valueType = 'absolute';
    conf.channel = 1;
    const json = JSON.stringify(conf);
    const result = parse<KnobConfig>(json);

    expect(result.number).toBe(30);
    expect(result.valueType).toBe('absolute');
    expect(result.channel).toBe(1);
  });
});
