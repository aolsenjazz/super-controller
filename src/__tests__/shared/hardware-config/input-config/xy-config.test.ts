import { XYDriver, InputDriverWithHandle } from '@shared/driver-types';
import { XYConfig } from '@shared/hardware-config/input-config';
import { parse } from '@shared/util';
import { ThreeByteMidiArray } from '@shared/midi-array/three-byte-midi-array';

const X: InputDriverWithHandle = {
  shape: 'circle',
  type: 'slider',
  interactive: true,
  height: 1,
  width: 1,
  response: 'continuous',
  number: 10,
  channel: 11,
  status: 'controlchange',
  availableColors: [],
  availableFx: [],
  inverted: false,
  horizontal: false,
  handleWidth: 0.5,
  handleHeight: 0.5,
};

const Y: InputDriverWithHandle = {
  shape: 'circle',
  type: 'slider',
  interactive: true,
  height: 1,
  width: 1,
  response: 'continuous',
  number: 11,
  channel: 12,
  status: 'pitchbend',
  availableColors: [],
  availableFx: [],
  inverted: false,
  horizontal: false,
  handleWidth: 0.5,
  handleHeight: 0.5,
};

const DRIVER: XYDriver = {
  x: X,
  y: Y,
  shape: 'circle',
  type: 'xy',
  height: 2,
  width: 2,
  interactive: true,
};

describe('fromDriver()', () => {
  test('loads values correctly', () => {
    const conf = XYConfig.fromDriver(DRIVER);
    expect(conf.x.number).toBe(X.number);
    expect(conf.y.number).toBe(Y.number);
  });
});

describe('toJSON()', () => {
  test('de/serializes correctly', () => {
    const conf = XYConfig.fromDriver(DRIVER);
    conf.x.number = 100;
    conf.y.number = 101;
    const json = JSON.stringify(conf);
    const result = parse<XYConfig>(json);

    expect(result.x.number).toBe(100);
    expect(result.y.number).toBe(101);
  });
});

describe('handleMessage()', () => {
  test('invokes x.handleMessage for x-originating msg', () => {
    const conf = XYConfig.fromDriver(DRIVER);
    const xMsg = new ThreeByteMidiArray([187, 10, 127]);
    const spy = jest.spyOn(conf.x, 'handleMessage');
    conf.handleMessage(xMsg);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  test('invokes y.handleMessage for y-originating msg', () => {
    const conf = XYConfig.fromDriver(DRIVER);
    const yMSg = new ThreeByteMidiArray([236, 10, 127]);
    const spy = jest.spyOn(conf.y, 'handleMessage');
    conf.handleMessage(yMSg);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('restoreDefaults()', () => {
  test('invokes x and y restoreDefaults()', () => {
    const conf = XYConfig.fromDriver(DRIVER);
    conf.x.number = 100;
    conf.y.number = 101;
    conf.restoreDefaults();
    expect(conf.x.number).toBe(X.number);
    expect(conf.y.number).toBe(Y.number);
  });
});

describe('id()', () => {
  test('returns correctly-formatted id', () => {
    const conf = XYConfig.fromDriver(DRIVER);
    expect(conf.id).toBe(`${conf.x.id}${conf.y.id}`);
  });
});
