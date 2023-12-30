import { InputResponse, PadDriver } from '@shared/driver-types';
import { PadConfig } from '@shared/hardware-config/input-config';
import { parse } from '@shared/util';

const DRIVER: PadDriver = {
  shape: 'circle',
  type: 'pad',
  interactive: true,
  height: 1,
  width: 1,
  response: 'gate',
  number: 10,
  channel: 11,
  status: 'controlchange',
  availableColors: [],
  availableFx: [],
};

describe('fromDriver', () => {
  test('set values correctly', () => {
    const conf = PadConfig.fromDriver(DRIVER);
    expect(conf.response).toBe(DRIVER.response);
    expect(conf.number).toBe(DRIVER.number);
    expect(conf.channel).toBe(DRIVER.channel);
  });
});

describe('toJSON', () => {
  test('de/serializes correctly', () => {
    const conf = PadConfig.fromDriver(DRIVER);
    conf.number = 20;
    conf.response = 'constant';
    conf.channel = 5;
    const json = JSON.stringify(conf);
    const result = parse<PadConfig>(json);

    expect(result.number).toBe(20);
    expect(result.response).toBe('constant');
    expect(result.channel).toBe(5);
  });
});

describe('restoreDefaults', () => {
  test('restores default values', () => {
    const conf = PadConfig.fromDriver(DRIVER);
    conf.number = 20;
    conf.response = 'constant';
    conf.channel = 5;
    conf.restoreDefaults();

    expect(conf.response).toBe(DRIVER.response);
    expect(conf.number).toBe(DRIVER.number);
    expect(conf.channel).toBe(DRIVER.channel);
  });
});

describe('set response', () => {
  test('going from gate -> constant changes statusString to noteon', () => {
    const gateDriver = {
      ...DRIVER,
      response: 'gate' as InputResponse,
      status: 'noteon/noteoff' as const,
    };
    const conf = PadConfig.fromDriver(gateDriver);
    conf.response = 'constant';
    expect(conf.statusString).toBe('noteon');
  });
  test('setting r=gate while ss=noteon, changes ss to default', () => {
    const gateDriver = {
      ...DRIVER,
      response: 'constant' as InputResponse,
    };
    const conf = PadConfig.fromDriver(gateDriver);
    conf.statusString = 'noteon';
    conf.response = 'gate';
    expect(conf.statusString).toBe('controlchange');
  });
});
