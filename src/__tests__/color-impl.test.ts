import { ColorImpl } from '@shared/hardware-config';
import { Color } from '@shared/driver-types';
import { parse, stringify } from '@shared/util';

const NUM = 10;
const CHAN = 11;

const GREEN: Color = {
  name: 'Green',
  array: [(144 + CHAN) as StatusNumber, NUM, 3],
  string: 'green',
  default: true,
};

const GREEN_BLINK: Color = {
  name: 'Green',
  array: [(144 + CHAN) as StatusNumber, NUM, 3],
  string: 'green',
  default: true,
  modifier: 'blink',
};

function createColor(c: Color) {
  return new ColorImpl(c);
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
    const json = stringify(c);
    const from = parse<ColorImpl>(json);

    expect(stringify(c)).toEqual(stringify(from));
  });
});
