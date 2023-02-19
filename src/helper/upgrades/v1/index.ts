import {
  SupportedDeviceConfig,
  AnonymousDeviceConfig,
  AdapterDeviceConfig,
  InputConfig,
  ColorImpl,
  DeviceConfig,
} from '@shared/hardware-config';

import {
  OverrideablePropagator,
  ColorConfigPropagator,
} from '@shared/propagators';

import { MidiArray, create } from '@shared/midi-array';
import { Project as V2Project } from '@shared/project';

import { statusStringToByte } from '@shared/midi-util';
import { stringify } from '@shared/util';

import { parse as v1parse } from './util';
import { Project } from './project';
import {
  SupportedDeviceConfig as v1SupportedDeviceConfig,
  AnonymousDeviceConfig as v1AnonymousDeviceConfig,
  AdapterDeviceConfig as v1AdapterDeviceConfig,
  InputConfig as v1InputConfig,
  ColorImpl as v1ColorImpl,
} from './hardware-config';

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
    const fxBindings = new Map<number, Channel>();

    const upgradedState0Color = upgradeColor(state0Color);
    const upgradedState1Color = upgradeColor(state1Color);

    if (upgradedState0Color !== undefined) {
      colorBindings.set(0, upgradedState0Color);
    }

    if (upgradedState1Color !== undefined) {
      colorBindings.set(1, upgradedState1Color);
    }

    if (state0Fx !== undefined) {
      fxBindings.set(0, state0Fx);
    }

    if (state1Fx !== undefined) {
      fxBindings.set(1, state1Fx);
    }

    const dev = new ColorConfigPropagator(
      nstep.hardwareResponse,
      nstep.outputResponse,
      colorBindings,
      fxBindings
    );

    const fx = v1.availableFx.map((f) => {
      return {
        ...f,
        target: 'channel' as const,
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
  const project = v1parse<Project>(projectString);

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

  const newProject = new V2Project(configs, Project.CURRENT_VERSION);
  return stringify(newProject);
}
