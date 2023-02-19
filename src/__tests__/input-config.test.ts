import { parse, stringify } from '@shared/util';
import { InputConfig, ColorImpl } from '@shared/hardware-config';
import { ColorConfigPropagator } from '@shared/propagators';
import { Color, FxDriver } from '@shared/driver-types';

const FX: FxDriver = {
  title: 'Blink',
  effect: 'Speed',
  default: true,
  validVals: [1, 2, 3],
  defaultVal: 1,
  lowBoundLabel: 'Slow',
  highBoundLabel: 'Fast',
};

const RED: Color = {
  name: 'Red',
  array: [145, 69, 6],
  string: 'red',
};

const GREEN: Color = {
  name: 'Green',
  array: [146, 69, 8],
  default: true,
  string: 'green',
};
const GreenImpl = new ColorImpl(GREEN);

interface Params {
  defaultVals?: InputConfig['default'];
  availableColors?: Color[];
  availableFx?: FxDriver[];
  overrideable?: boolean;
  type?: InputConfig['type'];
  value?: MidiNumber;
  colorConfig?: Map<number, Color>;
  activeFx?: [number, string][];
}
function createConfig({
  defaultVals = {
    number: 69,
    eventType: 'controlchange',
    channel: 0,
    response: 'gate',
  },
  availableColors = [RED, GREEN],
  availableFx = [FX],
  overrideable = true,
  type = 'pad',
  value = undefined,
  colorConfig = undefined,
  activeFx = undefined,
}: Params) {
  const colors = availableColors.map((c) => new ColorImpl(c));
  const config = new Map<number, ColorImpl>();
  if (colorConfig) {
    colorConfig.forEach((v, k) => {
      config.set(k, new ColorImpl(v));
    });
  }

  const outputPropagator = undefined;
  let devicePropagator;
  if (colorConfig) {
    devicePropagator = new ColorConfigPropagator(
      defaultVals.response,
      defaultVals.response,
      config,
      new Map()
    );
  }

  const newConfig = new InputConfig(
    defaultVals,
    colors,
    availableFx,
    overrideable,
    type,
    value,
    outputPropagator,
    devicePropagator,
    'endless'
  );

  if (activeFx) {
    activeFx.forEach(([state, fx]) => {
      newConfig.setFx(state, fx);
    });
  }

  return newConfig;
}

describe('colorForState', () => {
  test('returns null when constructed without colorConfig', () => {
    const config = createConfig({ availableColors: [] });

    expect(config.colorForState(0)).toEqual(undefined);
  });

  test('state[0] RED when constructed with config', () => {
    const colorConfig = new Map();
    colorConfig.set(0, RED);
    const config = createConfig({ colorConfig });

    expect(config.colorForState(0)!.name).toEqual(RED.name);
  });

  test('state[1] RED when constructed with config', () => {
    const colorConfig = new Map();
    colorConfig.set(1, RED);
    const config = createConfig({ colorConfig });

    expect(config.colorForState(1)!.name).toEqual(RED.name);
  });

  test('state[0] RED state[1] GREEN when constructed with config', () => {
    const colorConfig = new Map();
    colorConfig.set(1, GREEN);
    colorConfig.set(0, RED);
    const config = createConfig({ colorConfig });

    expect(config.colorForState(0)!.name).toEqual(RED.name);
    expect(config.colorForState(1)!.name).toEqual(GREEN.name);
  });
});

describe('setColorForState', () => {
  test('overwrites color', () => {
    const colorConfig = new Map();
    colorConfig.set(1, GREEN);
    colorConfig.set(0, RED);
    const config = createConfig({ colorConfig });

    config.setColorForState(0, GreenImpl.displayName);

    expect(config.colorForState(0)!.name).toEqual(GREEN.name);
  });

  test('set color when was previously unset', () => {
    const config = createConfig({});

    config.setColorForState(0, GreenImpl.displayName);

    expect(config.colorForState(0)!.name).toEqual(GREEN.name);
  });
});

describe('restoreDefault', () => {
  test('restores defaults', () => {
    const d: InputConfig['default'] = {
      number: 2,
      channel: 2,
      eventType: 'noteon/noteoff',
      response: 'gate',
    };
    const config = createConfig({ defaultVals: d });

    expect(config.number).toEqual(d.number);
    expect(config.channel).toEqual(d.channel);
    expect(config.eventType).toEqual(d.eventType);
    expect(config.response).toEqual(d.response);

    config.number = 3;
    config.channel = 3;
    config.eventType = 'controlchange';
    config.response = 'toggle';

    expect(config.number).toEqual(3);
    expect(config.channel).toEqual(3);
    expect(config.eventType).toEqual('controlchange');
    expect(config.response).toEqual('toggle');

    config.restoreDefaults();

    expect(config.number).toEqual(d.number);
    expect(config.channel).toEqual(d.channel);
    expect(config.eventType).toEqual(d.eventType);
    expect(config.response).toEqual(d.response);
  });
});

describe('toJSON', () => {
  test('serializes + deserializes correct', () => {
    const d: InputConfig['default'] = {
      number: 2,
      channel: 2,
      eventType: 'noteon/noteoff',
      response: 'gate',
    };
    const config = createConfig({ defaultVals: d });
    const json = stringify(config);
    const from = parse<InputConfig>(json);

    expect(from.default).toEqual(d);
    expect(from.nickname).toEqual(config.nickname);
    expect(from.overrideable).toEqual(config.overrideable);
    expect(from.type).toEqual(config.type);
    expect(JSON.stringify(from.availableColors)).toEqual(
      JSON.stringify(config.availableColors)
    );
    expect(JSON.stringify(from.outputPropagator)).toEqual(
      JSON.stringify(config.outputPropagator)
    );
    expect(JSON.stringify(from.devicePropagator)).toEqual(
      JSON.stringify(config.devicePropagator)
    );
    expect(from.knobType).toBe(config.knobType);
  });
});

describe('get activeFx', () => {
  test('returns undefined for no fx', () => {
    const config = createConfig({ availableColors: [RED] });

    expect(config.getFx(0)).toBe(undefined);
  });

  test('returns title for color with default fx', () => {
    const config = createConfig({ availableColors: [GREEN] });

    expect(config.getFx(0)).toBe(FX);
  });
});
