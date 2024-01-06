import {
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
  AdapterDeviceConfig,
  InputConfig,
  ColorImpl,
  DeviceConfig,
} from './legacy/v2/hardware-config';

import {
  OverrideablePropagator,
  ColorConfigPropagator,
} from './legacy/v2/propagators';

import { MidiArray, create } from './legacy/v2/midi-array';
import { Project as V2Project } from './legacy/v2/project';

import { statusStringToByte } from './legacy/v2/midi-util';
import { stringify } from './legacy/v2/util';

import { parse as v1parse } from './legacy/v1/util';
import { Project as V1Project } from './legacy/v1/project';
import {
  SupportedDeviceConfig as v1SupportedDeviceConfig,
  AnonymousDeviceConfig as v1AnonymousDeviceConfig,
  AdapterDeviceConfig as v1AdapterDeviceConfig,
  InputConfig as v1InputConfig,
  ColorImpl as v1ColorImpl,
} from './legacy/v1/hardware-config';
import { BaseUpgrade } from './common/base-upgrade';

function upgradeColor(v1c: v1ColorImpl | undefined) {
  if (v1c !== undefined) {
    const newColor = new ColorImpl({
      name: v1c.name,
      string: v1c.string,
      modifier: v1c.modifier,
      default: v1c.isDefault,
      array: v1c,
    });

    return newColor;
  }
  return undefined;
}

function convertV1SupportedToV2(d: v1SupportedDeviceConfig) {
  const inputs = d.inputs.map((v1: v1InputConfig) => {
    const availColors = v1.availableColors.map((c: v1ColorImpl) => {
      return new ColorImpl({
        name: c.name,
        string: c.string,
        array: [
          (statusStringToByte(c.eventType) + c.channel) as StatusByte,
          c.number,
          c.value,
        ],
        modifier: c.modifier,
        default: c.isDefault || false,
      });
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const prop: OverrideablePropagator = v1.outputPropagator;
    const nstep = v1.devicePropagator;

    const state0Color = v1.colorForState(0);
    const state0Fx = v1.getFxVal(0);
    const state1Color = v1.colorForState(1);
    const state1Fx = v1.getFxVal(1);

    const colorBindings = new Map<number, ColorImpl>();
    const fxBindings = new Map<number, MidiNumber[]>();

    const upgradedState0Color = upgradeColor(state0Color);
    const upgradedState1Color = upgradeColor(state1Color);

    if (upgradedState0Color !== undefined) {
      colorBindings.set(0, upgradedState0Color);
    }

    if (upgradedState1Color !== undefined) {
      colorBindings.set(1, upgradedState1Color);
    }

    if (state0Fx !== undefined) {
      fxBindings.set(0, [state0Fx, 0, 0]);
    }

    if (state1Fx !== undefined) {
      fxBindings.set(1, [state1Fx, 0, 0]);
    }

    const dev = new ColorConfigPropagator(
      nstep.hardwareResponse,
      nstep.outputResponse,
      colorBindings,
      fxBindings
    );

    const fx = v1.availableFx.map((f) => {
      return {
        title: f.title,
        lowBoundLabel: f.lowBoundLabel,
        highBoundLabel: f.highBoundLabel,
        isDefault: f.defaultVal === 6,
        effect: f.effect,
        defaultVal: [f.defaultVal, 0 as MidiNumber, 0 as MidiNumber],
        validVals: f.validVals.map((v) => [
          v,
          0 as MidiNumber,
          0 as MidiNumber,
        ]),
      };
    });

    return new InputConfig(
      v1.default,
      availColors,
      fx,
      v1.overrideable,
      v1.type,
      v1.value,
      prop,
      dev,
      v1.knobType,
      v1.valueType,
      v1.nickname
    );
  });

  return new SupportedDeviceConfig(
    d.name,
    d.siblingIndex,
    d.shareSustain,
    inputs,
    d.nickname,
    d.keyboardDriver
  );
}

export function upgradeToV2(projectString: string) {
  const project = v1parse<V1Project>(projectString);

  const configs: DeviceConfig[] = [];
  project.devices.forEach((d) => {
    let newConfig;
    if (d instanceof v1SupportedDeviceConfig) {
      newConfig = convertV1SupportedToV2(d);
    } else if (d instanceof v1AnonymousDeviceConfig) {
      const oldOverrides = d.overrides;
      const newOverrides = new Map<string, MidiArray>();

      oldOverrides.forEach((v, k) => {
        newOverrides.set(k, create(v));
      });

      newConfig = new AnonymousDeviceConfig(
        d.name,
        d.siblingIndex,
        newOverrides,
        d.shareSustain,
        d.nickname
      );
    } else if (d instanceof v1AdapterDeviceConfig) {
      // eslint-disable-next-line prefer-destructuring
      let child: v1SupportedDeviceConfig | SupportedDeviceConfig | undefined =
        d.child;

      if (child !== undefined) child = convertV1SupportedToV2(child);

      newConfig = new AdapterDeviceConfig(
        d.name,
        d.siblingIndex,
        child as SupportedDeviceConfig | undefined
      );
    } else {
      throw new Error('wat');
    }

    configs.push(newConfig);
  });

  const newProject = new V2Project(configs);
  return stringify(newProject);
}

export class V1ToV2 extends BaseUpgrade {
  applyUpgrade(v1ProjectString: string) {
    return upgradeToV2(v1ProjectString);
  }

  rollback(freshProjectString: string) {
    return freshProjectString;
  }

  verify(): void {
    throw new Error('cant be arsed');
  }
}
