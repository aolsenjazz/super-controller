import { LightCapableInputConfig as WrapMe } from '@shared/hardware-config/input-config';
import { FxDriver, Color, InputResponse } from '@shared/driver-types';
import { GatePropagator, ColorConfigPropagator } from '@shared/propagators';
import { create } from '@shared/midi-array';

class LightCapableInputConfig extends WrapMe {
  get eligibleLightResponses() {
    return ['gate' as const, 'toggle' as const];
  }

  get eligibleLightStates() {
    return [0, 1];
  }

  get eligibleResponses() {
    return ['gate' as const];
  }

  get eligibleStatusStrings() {
    return ['controlchange' as const];
  }

  get response() {
    return 'gate' as const;
  }

  set response(_or: InputResponse) {
    Function.prototype(); // noop to satisfy compiler
  }

  get deviceProp() {
    return this.devicePropagator;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.defaults,
        this.availableColors,
        this.availableFx,
        this.outputPropagator,
        this.devicePropagator,
        this.nickname,
      ],
    };
  }
}

const D = {
  response: 'gate' as const,
  statusString: 'noteon/noteoff' as const,
  channel: 2 as Channel,
  number: 5 as MidiNumber,
};

const OUT_PROP = new GatePropagator(
  'gate',
  D.statusString,
  D.number,
  D.channel
);

const C: Color[] = [
  {
    name: 'Off',
    string: 'transparent',
    array: [144, 0, 0],
    default: true,
    effectable: false,
  },
  {
    name: 'Red',
    string: 'red',
    array: [144, 0, 1],
    effectable: true,
  },
  {
    name: 'Blue',
    string: 'Blue',
    array: [144, 0, 2],
    effectable: true,
  },
];

const F: FxDriver[] = [
  {
    title: 'Solid',
    defaultVal: [1, 0, 0],
    effect: 'Brightness',
    validVals: [
      [1, 0, 0],
      [2, 0, 0],
    ],
    isDefault: true,
  },
  {
    title: 'Blink',
    defaultVal: [3, 0, 0],
    effect: 'Speed',
    validVals: [
      [3, 0, 0],
      [4, 0, 0],
    ],
    isDefault: false,
  },
];

const fullMap = new Map<number, Color>();
fullMap.set(0, C[0]);
fullMap.set(1, C[1]);
const FULL_PROP = new ColorConfigPropagator(
  D.response,
  D.response,
  C[0],
  F[0],
  fullMap
);
const EMPTY_PROP = new ColorConfigPropagator(
  D.response,
  D.response,
  undefined,
  undefined,
  new Map()
);

describe('handleMessage', () => {
  test('invokes devicePropagator.handleMessage', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    const spy = jest.spyOn(ic.deviceProp, 'handleMessage');
    ic.handleMessage(create([144, 0, 0]));
    expect(spy).toHaveBeenCalled();
  });
  test('invokes outputPropagator.handleMessage', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    const spy = jest.spyOn(ic.outputPropagator, 'handleMessage');
    ic.handleMessage(create([144, 0, 0]));
    expect(spy).toHaveBeenCalled();
  });
});

describe('getFx', () => {
  test('returns fx for state', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    ic.setFx(1, 'Blink');
    expect(ic.getFx(1)).toEqual(F[1]);
  });
  test('returns undefined for unset state', () => {
    const ic = new LightCapableInputConfig(D, [], [], OUT_PROP);
    expect(ic.getFx(1)).toBeUndefined();
  });
});

describe('setFx', () => {
  test('sets fx using string', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    ic.setFx(1, 'Blink');
    expect(ic.getFxVal(1)).toEqual(F[1].defaultVal);
  });

  test('sets fx using obj', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    ic.setFx(1, F[1]);
    expect(ic.getFxVal(1)).toEqual(F[1].defaultVal);
  });

  test('sets fx using MidiNumber[]', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    ic.setFx(1, [3, 0, 0]);
    expect(ic.getFxVal(1)).toEqual(F[1].defaultVal);
  });
  test('throws for nonexistent fx', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    expect(() => {
      ic.setFx(1, 'nonsense');
    }).toThrow();
  });
});

describe('setColor', () => {
  test('throws for nonexistent color', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);

    expect(() => {
      ic.setColor(0, 'bad');
    }).toThrow();
  });
  test('invokes deviceProp.setColor using string', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    const spy = jest.spyOn(ic.deviceProp, 'setColor');
    ic.setColor(0, 'Red');
    expect(spy).toHaveBeenCalled();
  });
  test('invokes deviceProp.setColor using obj', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, FULL_PROP);
    const spy = jest.spyOn(ic.deviceProp, 'setColor');
    ic.setColor(0, C[1]);
    expect(spy).toHaveBeenCalled();
  });
});

describe('restoreDefaults', () => {
  test('invokes deviceProp.restoreDefaults', () => {
    const ic = new LightCapableInputConfig(D, C, F, OUT_PROP, EMPTY_PROP);
    const spy = jest.spyOn(ic.deviceProp, 'restoreDefaults');
    ic.restoreDefaults();
    expect(spy).toHaveBeenCalled();
  });
});
