import {
  XYDriver,
  PadDriver,
  InputDriverWithHandle,
} from '@shared/driver-types';
import { getDiff, inputIdFromDriver } from '@shared/util';

const TwoByteDriver: PadDriver = {
  shape: 'circle',
  type: 'pad',
  interactive: true,
  height: 1,
  width: 1,
  response: 'gate',
  number: 10,
  channel: 11,
  status: 'programchange',
  availableColors: [],
  availableFx: [],
};

const ThreeByteDriver: PadDriver = {
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

const XYDrive: XYDriver = {
  x: X,
  y: Y,
  shape: 'circle',
  type: 'xy',
  height: 2,
  width: 2,
  interactive: true,
};

test('getDiff returns no PortPairs if same list', () => {
  const ids = ['1', '2', '3'];
  const result = getDiff(ids, ids);

  expect(result[0].length).toBe(0);
});

test('getDiff returns 1 pair at first index', () => {
  const ids1 = ['1', '2'];
  const ids2 = ['1'];

  const result = getDiff(ids1, ids2);

  expect(result[0].length).toBe(1);
});

test('getDiff returns 1 pair at second index', () => {
  const ids1 = ['1'];
  const ids2 = ['1', '2'];

  const result = getDiff(ids1, ids2);

  expect(result[1].length).toBe(1);
});

describe('id', () => {
  test('returns expected ID for xy driver', () => {
    const result = inputIdFromDriver(TwoByteDriver);
    expect(result).toBe('programchange.11.10');
  });

  test('returns expected ID for two-byte driver', () => {
    const result = inputIdFromDriver(ThreeByteDriver);
    expect(result).toBe('controlchange.11.10');
  });

  test('returns expected ID for three-byte driver', () => {
    const result = inputIdFromDriver(XYDrive);
    expect(result).toBe('controlchange.11.10pitchbend.12');
  });
});
