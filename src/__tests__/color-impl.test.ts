import { ColorImpl } from '@shared/hardware-config';
import { Color } from '@shared/driver-types';

const NUM = 10;
const CHAN = 11;

const FX: Color['fx'][number] = {
  title: 'Blink',
  effect: 'Speed',
  validVals: [1, 2, 3],
  defaultVal: 1,
  lowBoundLabel: 'Slow',
  highBoundLabel: 'Fast',
};

const DEF_FX: Color['fx'][number] = {
  title: 'Solid',
  effect: 'Speed',
  validVals: [1, 2, 3],
  defaultVal: 1,
  default: true,
  lowBoundLabel: 'Slow',
  highBoundLabel: 'Fast',
};

const GREEN: Color = {
  name: 'Green',
  eventType: 'noteon' as StatusString,
  value: 3,
  string: 'green',
  default: true,
  fx: [],
};

const GREEN_BLINK: Color = {
  name: 'Green',
  eventType: 'noteon' as StatusString,
  value: 3,
  string: 'green',
  default: true,
  modifier: 'blink',
  fx: [],
};

function createColor(c: Color, fx?: Color['fx']) {
  const effectedColor = { ...c, fx: fx || [] };
  return ColorImpl.fromDrivers(effectedColor, NUM, CHAN);
}

describe('get id', () => {
  test('returns correct id for not modifier', () => {
    const c = createColor(GREEN, [FX]);
    expect(c.id).toEqual(`${GREEN_BLINK.string}.${undefined}`);
  });

  test('returns correct id for modifier', () => {
    const c = createColor(GREEN_BLINK, [FX]);
    expect(c.id).toEqual(`${GREEN_BLINK.string}.${GREEN_BLINK.modifier}`);
  });
});

describe('getDisplayName', () => {
  test('returns correct value for not modifier', () => {
    const c = createColor(GREEN, [FX]);
    expect(c.displayName).toEqual('Green');
  });

  test('returns correct value for modifier', () => {
    const c = createColor(GREEN_BLINK, [FX]);
    expect(c.displayName).toEqual('Green (blink)');
  });
});

describe('get activeFx', () => {
  test('returns undefined for no fx', () => {
    const c = createColor(GREEN, [FX]);
    expect(c.activeFx).toBe(undefined);
  });

  test('returns title for color with default fx', () => {
    const c = createColor(GREEN, [DEF_FX]);
    expect(c.activeFx).toBe(DEF_FX.title);
  });

  test('returns title for color with applied fx', () => {
    const c = createColor(GREEN, [FX]);
    c.setFx(FX.title);
    expect(c.activeFx).toBe(FX.title);
  });
});

describe('toJSON', () => {
  test('serializes and deserializes correctly', () => {
    const c = createColor(GREEN, [DEF_FX]);
    const json = JSON.stringify(c);
    const from = ColorImpl.fromJSON(json);

    expect(c.toJSON()).toEqual(from.toJSON());
  });
});
