import { MidiArray } from '@shared/midi-array';
import { InputConfig, ColorImpl } from '@shared/hardware-config';
import { NStepPropagator } from '@shared/propagators';
import { Color } from '@shared/driver-types';

const FX: Color['fx'][number] = {
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
  eventType: 'noteon',
  value: 6,
  default: false,
  string: 'red',
  fx: [FX],
};

const GREEN: Color = {
  name: 'Green',
  eventType: 'noteon',
  value: 8,
  default: true,
  string: 'green',
  fx: [FX],
};
const GreenImpl = ColorImpl.fromDrivers(GREEN, 0, 0);

interface Params {
  defaultVals?: InputConfig['default'];
  availableColors?: Color[];
  overrideable?: boolean;
  type?: InputConfig['type'];
  value?: MidiNumber;
  colorConfig?: Map<number, Color>;
}
function createConfig({
  defaultVals = {
    number: 69,
    eventType: 'controlchange',
    channel: 0,
    response: 'gate',
  },
  availableColors = [RED, GREEN],
  overrideable = true,
  type = 'pad',
  value = undefined,
  colorConfig = undefined,
}: Params) {
  const colors = availableColors.map((c) =>
    ColorImpl.fromDrivers(c, defaultVals.number, defaultVals.channel)
  );
  const config = new Map<number, MidiArray>();
  if (colorConfig) {
    colorConfig.forEach((v, k) => {
      config.set(
        k,
        ColorImpl.fromDrivers(v, defaultVals.number, defaultVals.channel)
      );
    });
  }

  const outputPropagator = undefined;
  let devicePropagator;
  if (colorConfig) {
    devicePropagator = new NStepPropagator(
      defaultVals.response,
      defaultVals.response,
      config
    );
  }

  const newConfig = new InputConfig(
    defaultVals,
    colors,
    overrideable,
    type,
    value,
    outputPropagator,
    devicePropagator
  );

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

  test('set color throws when  state out of bounds', () => {
    const config = createConfig({});

    expect(() => {
      config.setColorForState(2, GreenImpl.displayName);
    }).toThrow();
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
    const json = config.toJSON(true);
    const from = InputConfig.fromJSON(json);

    expect(from.default).toEqual(d);
    expect(from.nickname).toEqual(config.nickname);
    expect(from.overrideable).toEqual(config.overrideable);
    expect(from.type).toEqual(config.type);
    expect(JSON.stringify(from.availableColors)).toEqual(
      JSON.stringify(config.availableColors)
    );
    expect(from.outputPropagator.toJSON(true)).toEqual(
      config.outputPropagator.toJSON(true)
    );
    expect(from.devicePropagator.toJSON(true)).toEqual(
      config.devicePropagator.toJSON(true)
    );
  });
});
