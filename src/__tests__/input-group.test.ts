import {
  PadConfig,
  SliderConfig,
  InputConfig,
  XYConfig,
} from '@shared/hardware-config/input-config';
import {
  ColorConfigPropagator,
  GatePropagator,
  ContinuousPropagator,
} from '@shared/propagators';
import { Color, FxDriver } from '@shared/driver-types';

import { InputGroup } from '../renderer/input-group';

const FX: FxDriver = {
  title: 'Blink',
  effect: 'Speed',
  isDefault: false,
  validVals: [
    [1, 0, 0],
    [2, 0, 0],
    [3, 0, 0],
  ],
  defaultVal: [1, 0, 0],
  lowBoundLabel: 'Slow',
  highBoundLabel: 'Fast',
};

const GREEN: Color = {
  name: 'green',
  array: [144, 69, 3],
  modifier: 'blink',
  string: 'green',
  default: true,
  effectable: true,
};

const RED: Color = {
  name: 'red',
  array: [144, 69, 5],
  string: 'red',
  default: false,
  effectable: true,
};

function createInput(
  seedNumber: Channel,
  statusString: StatusString | 'noteon/noteoff',
  response: 'gate' | 'continuous',
  availableColors: Color[] = [],
  availableFx: FxDriver[] = [],
  lightConfig: Map<number, Color> = new Map(),
  activeFx?: [number, string][],
  setDefaultColor = false
) {
  const def = {
    number: seedNumber,
    channel: seedNumber,
    statusString,
    response,
  };

  const config = new Map<number, Color>();
  lightConfig.forEach((v, k) => {
    config.set(k, v);
  });

  let outProp;
  let devicePropagator;
  if (lightConfig) {
    devicePropagator = new ColorConfigPropagator(
      def.response as 'gate',
      def.response as 'gate',
      setDefaultColor ? GREEN : undefined,
      undefined,
      config
    );
  }

  let ic: InputConfig;
  if (response === 'gate') {
    outProp = new GatePropagator(
      response as 'gate' | 'toggle' | 'constant',
      statusString,
      seedNumber,
      seedNumber
    );
    ic = new PadConfig(
      def,
      availableColors,
      availableFx,
      outProp,
      devicePropagator
    );

    if (activeFx) {
      activeFx.forEach(([state, fx]) => {
        (ic as PadConfig).setFx(state, fx);
      });
    }
  } else {
    outProp = new ContinuousPropagator(
      response as 'continuous' | 'constant',
      statusString,
      seedNumber,
      seedNumber
    );

    ic = new SliderConfig(def, outProp);
  }

  return ic;
}

function createGatePadInput(
  seedNumber: Channel = 0,
  includeAvailableColors = false,
  includeLightConfig = false,
  includeAvailableFx = false,
  includeActiveFx = false,
  setDefaultColor = false
) {
  const colors = includeAvailableColors ? [GREEN, RED] : [];
  const lightConfig = new Map<number, Color>();
  if (includeLightConfig) {
    lightConfig.set(1, GREEN);
    lightConfig.set(0, RED);
  }

  const availableFx = includeAvailableFx && includeAvailableColors ? [FX] : [];

  const ic = createInput(
    seedNumber,
    'noteon/noteoff',
    'gate',
    colors,
    availableFx,
    lightConfig,
    [],
    setDefaultColor
  );

  if (includeActiveFx && ic instanceof PadConfig) {
    ic.setFx(0, FX.title);
    ic.setFx(1, FX.title);
  }

  return ic;
}

function createXYInput(seedNumber: Channel = 0) {
  const defs = {
    number: seedNumber,
    channel: seedNumber,
    statusString: 'controlchange' as const,
    response: 'continuous' as const,
  };

  const op = new ContinuousPropagator(
    'continuous',
    'controlchange',
    seedNumber,
    seedNumber
  );

  return new XYConfig(defs, op);
}

function createSliderInput(seedNumber: Channel = 0) {
  return createInput(seedNumber, 'controlchange', 'continuous');
}

describe('labels', () => {
  test('labelForNumber returns number for inputs w/diff statusStrings', () => {
    const gate = createGatePadInput(0);
    const slider = createSliderInput(1);
    const group = new InputGroup([gate, slider]);
    expect(group.labelForNumber(3)).toBe('3');
  });

  test('labelForNumber returns number for empty inputs list', () => {
    const group = new InputGroup([]);
    expect(group.labelForNumber(3)).toBe('3');
  });

  test('labelForNumber includes default CC role', () => {
    const slider = createSliderInput(10);
    const group = new InputGroup([slider]);
    expect(group.labelForNumber(10).includes('default')).toBe(true);
  });

  test('labelForNumber includes input default status', () => {
    const slider = createSliderInput(10);
    const group = new InputGroup([slider]);
    expect(group.labelForNumber(9).includes('default')).toBe(false);
  });

  test('labelForChannel does not include default status', () => {
    const slider = createSliderInput(10);
    const group = new InputGroup([slider]);
    expect(group.labelForChannel(9).includes('default')).toBe(false);
  });

  test('labelForChannel includes default status', () => {
    const slider = createSliderInput(2);
    const group = new InputGroup([slider]);
    expect(group.labelForChannel(2).includes('default')).toBe(true);
  });

  test('labelForEventType returns correct statusString for multiple, similar inputs', () => {
    const pad1 = createGatePadInput(1);
    const pad2 = createGatePadInput(2);
    const group = new InputGroup([pad1, pad2]);
    expect(group.labelForEventType('noteon/noteoff')).toBe('noteon/noteoff');
  });

  test('labelForResponse returns correct response for group with similar inputs', () => {
    const pad1 = createGatePadInput(1);
    const group = new InputGroup([pad1]);
    expect(group.labelForResponse('gate')).toBe('gate [default]');
  });
});

describe('colorForState', () => {
  test('return null for unset availableColors', () => {
    const pad1 = createGatePadInput(0);
    const group = new InputGroup([pad1]);
    expect(group.colorForState(0)).toBe(null);
  });

  test('returns default for unset light config', () => {
    const pad1 = createGatePadInput(0, true, false, false, false, true);
    const group = new InputGroup([pad1]);

    expect(group.colorForState(1)!.name).toEqual('green');
  });

  test('returns the correct color', () => {
    const pad1 = createGatePadInput(0, true, true);
    const group = new InputGroup([pad1]);

    expect(group.colorForState(0)!.name).toEqual('red');
  });

  test('returns correct color for matching input pads', () => {
    const pad1 = createGatePadInput(0, true, true);
    const pad2 = createGatePadInput(1, true, true);
    const group = new InputGroup([pad1, pad2]);

    const result = group.colorForState(0);

    expect(result!.name).toEqual('red');
  });

  test('returns multiple values for mismatch pads', () => {
    const pad1 = createGatePadInput(0, true, true);
    const pad2 = createGatePadInput(1);
    const group = new InputGroup([pad1, pad2]);
    const result = group.colorForState(0);

    expect(result!.name).toEqual('<multiple values>');
  });
});

describe('isMultiInput', () => {
  test('returns true for xy', () => {
    const xy = createXYInput(0);
    const xy2 = createXYInput(1);
    const group = new InputGroup([xy, xy2]);
    expect(group.isMultiInput).toBe(true);
  });
});

describe('number getter', () => {
  test('returns correct value for group', () => {
    const gate1 = createGatePadInput(1);
    const gate2 = createGatePadInput(1);
    const group = new InputGroup([gate1, gate2]);
    expect(group.number).toBe(1);
  });

  test('returns <multiple values>', () => {
    const gate1 = createGatePadInput(0);
    const gate2 = createGatePadInput(1);
    const group = new InputGroup([gate1, gate2]);
    expect(group.number).toBe('<multiple values>');
  });
});

describe('eligibleEventTypes', () => {
  test('returns correct statusStrings for similar inputs', () => {
    const slider1 = createSliderInput(0);
    const slider2 = createSliderInput(1);
    const group = new InputGroup([slider1, slider2]);
    const eligibleEventTypes = [
      'noteon',
      'noteoff',
      'controlchange',
      'programchange',
    ];
    expect(group.eligibleEventTypes).toEqual(eligibleEventTypes);
  });

  test('returns correct statusStrings for different inputs', () => {
    const gate = createGatePadInput(0);
    const slider = createSliderInput(1);
    const group = new InputGroup([gate, slider]);
    expect(group.eligibleEventTypes.length).toBe(0);
  });
});

describe('eligibleColors', () => {
  test('returns the correct array value', () => {
    const pad1 = createGatePadInput(0, true, true);
    const pad2 = createGatePadInput(1, true, true);
    const group = new InputGroup([pad1, pad2]);
    const expected = (pad1 as PadConfig).availableColors.length;
    expect(group.eligibleColors.length).toBe(expected);
  });

  test('returns an empty array', () => {
    const pad1 = createGatePadInput(0, true, true);
    const pad2 = createGatePadInput(1);
    const group = new InputGroup([pad1, pad2]);
    expect(group.eligibleColors.length).toBe(0);
  });
});

describe('eligibleFx', () => {
  test('returns the correct array value', () => {
    const pad1 = createGatePadInput(0, true, true, true);
    const pad2 = createGatePadInput(1, true, true, true);
    const group = new InputGroup([pad1, pad2]);

    expect(JSON.stringify(group.eligibleFx)).toEqual(JSON.stringify([FX]));
  });

  test('returns empty array for no color.fx', () => {
    const pad1 = createGatePadInput(0, true, true);
    const pad2 = createGatePadInput(1, true, false);
    const group = new InputGroup([pad1, pad2]);
    expect(group.eligibleFx).toEqual([]);
  });

  test('returns [] for no currentColor', () => {
    const pad1 = createGatePadInput(0, false, false);
    const pad2 = createGatePadInput(1, false, false);
    const group = new InputGroup([pad1, pad2]);
    expect(group.eligibleFx).toEqual([]);
  });
});
