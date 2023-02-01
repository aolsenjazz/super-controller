import { ColorImpl } from '@shared/hardware-config';
import { Color } from '@shared/driver-types';

const NUM = 10;
const CHAN = 11;

// const FX: Color['fx'][number] = {
//   title: 'Blink',
//   effect: 'Speed',
//   validVals: [1, 2, 3],
//   defaultVal: 1,
//   lowBoundLabel: 'Slow',
//   highBoundLabel: 'Fast',
// };

// const DEF_FX: Color['fx'][number] = {
//   title: 'Solid',
//   effect: 'Speed',
//   validVals: [1, 2, 3],
//   defaultVal: 1,
//   default: true,
//   lowBoundLabel: 'Slow',
//   highBoundLabel: 'Fast',
// };

const GREEN: Color = {
  name: 'Green',
  eventType: 'noteon' as StatusString,
  value: 3,
  string: 'green',
  default: true,
};

const GREEN_BLINK: Color = {
  name: 'Green',
  eventType: 'noteon' as StatusString,
  value: 3,
  string: 'green',
  default: true,
  modifier: 'blink',
};

function createColor(c: Color) {
  const effectedColor = { ...c };
  return ColorImpl.fromDrivers(effectedColor, NUM, CHAN);
}

describe('getDisplayName', () => {
  test('returns correct value for not modifier', () => {
    const c = createColor(GREEN);
    expect(c.displayName).toEqual('Green');
  });

  test('returns correct value for modifier', () => {
    const c = createColor(GREEN_BLINK);
    expect(c.displayName).toEqual('Green (blink)');
  });
});

describe('toJSON', () => {
  test('serializes and deserializes correctly', () => {
    const c = createColor(GREEN_BLINK);
    const json = JSON.stringify(c);
    const from = ColorImpl.fromJSON(json);

    expect(c.toJSON()).toEqual(from.toJSON());
  });
});
