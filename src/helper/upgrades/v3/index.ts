import {
  DeviceConfig,
  SupportedDeviceConfig,
  AdapterDeviceConfig,
  AnonymousDeviceConfig,
} from './shared/hardware-config';
import { Project } from './shared/project';
import { stringify } from './shared/util';
import {
  KnobConfig,
  PadConfig,
  PitchbendConfig,
  SliderConfig,
  SwitchConfig,
  XYConfig,
} from './shared/hardware-config/input-config';
import {
  ContinuousPropagator,
  ColorConfigPropagator,
  createPropagator,
} from './shared/propagators';
import { Color } from './shared/driver-types';

import { parse as v3Parse } from './util';
import { Project as V3Project } from './project';
import {
  AdapterDeviceConfig as V3AdapterConfig,
  SupportedDeviceConfig as V3SupportedDeviceConfig,
  InputConfig as V3InputConfig,
  AnonymousDeviceConfig as V2AnonymousConfig,
} from './hardware-config';

function constructInput(i: V3InputConfig) {
  const defs = {
    statusString: i.default.statusString,
    response: i.default.response,
    number: i.default.number,
    channel: i.default.channel,
  };

  const hasFx = i.availableFx.length > 0;
  const colors = i.availableColors.map((c) => {
    return {
      array: c.array,
      name: c.name,
      string: c.string,
      default: c.isDefault,
      modifier: c.modifier,
      effectable: ['Off', 'Clear', 'clear', 'off'].includes(c!.name) && hasFx,
    };
  });

  const outProp = createPropagator(
    i.outputPropagator.hardwareResponse,
    i.outputPropagator.outputResponse,
    i.outputPropagator.statusString,
    i.outputPropagator.number,
    i.outputPropagator.channel,
    i.outputPropagator.value,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (i.outputPropagator as any).knobType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (i.outputPropagator as any).valueType
  );

  const cb = new Map<number, Color>();
  Array.from(i.devicePropagator.colorBindings.keys()).forEach((k) => {
    const c = i.colorForState(k);

    if (c === undefined) throw new Error('whoops');

    const newC = {
      array: c!.array,
      name: c!.name,
      string: c!.string,
      default: c!.isDefault,
      modifier: c!.modifier,
      effectable: ['Off', 'Clear', 'clear', 'off'].includes(c!.name) && hasFx,
    };

    cb.set(k, newC);
  });

  const defColorImpl = i.defaultColor;
  let defColor;
  if (defColorImpl !== undefined) {
    defColor = {
      array: defColorImpl.array,
      name: defColorImpl.name,
      string: defColorImpl.string,
      default: defColorImpl.isDefault,
      modifier: defColorImpl.modifier,
      effectable:
        ['Off', 'Clear', 'clear', 'off'].includes(defColorImpl.name) && hasFx,
    };
  }

  const defFx = i.defaultFx;

  const devProp = new ColorConfigPropagator(
    i.devicePropagator.hardwareResponse,
    i.devicePropagator.outputResponse,
    defColor,
    defFx,
    cb,
    i.devicePropagator.fxBindings,
    i.devicePropagator.currentStep
  );

  switch (i.type) {
    case 'knob':
      return new KnobConfig(
        defs,
        outProp as ContinuousPropagator,
        i.knobType || 'absolute'
      );
    case 'pad':
      return new PadConfig(
        defs,
        colors,
        i.availableFx,
        outProp,
        devProp,
        i.value
      );
    case 'wheel':
      return defs.statusString === 'pitchbend'
        ? new PitchbendConfig(defs, outProp)
        : new SliderConfig(defs, outProp);
    case 'slider':
    case 'xy':
      return new SliderConfig(defs, outProp);
    case 'switch':
      return new SwitchConfig(defs, outProp);
    default:
      throw new Error(`unrecognized driver type ${i.type}`);
  }
}

function convertInputs(ins: V3InputConfig[]) {
  // assemble xy configs outside of master mapping function
  const sliderConfigs = ins
    .filter((i) => i.type === 'xy')
    .map((i) => constructInput(i)) as SliderConfig[];

  const xyConfigs = sliderConfigs
    .filter((_i, idx) => idx % 2 === 1)
    .map((i, idx) => {
      // at this point, each `i` represents a y-plane `SliderConfig`s belonging to an xy pair
      const sisterConfig = sliderConfigs[idx - 1];
      return new XYConfig(sisterConfig, i);
    });

  // strip all old xyconfigs, all new xy configs
  const newConfigs: (
    | XYConfig
    | PadConfig
    | SliderConfig
    | SwitchConfig
    | KnobConfig
  )[] = ins.filter((i) => i.type !== 'xy').map((i) => constructInput(i));

  return newConfigs.concat(xyConfigs);
}

export function upgradeToV4(projectString: string) {
  const project = v3Parse<V3Project>(projectString);

  const configs: DeviceConfig[] = [];
  project.devices.forEach((d) => {
    if (d instanceof V3AdapterConfig) {
      const newChild = new SupportedDeviceConfig(
        d.child!.name,
        d.child!.siblingIndex,
        d.child!.shareSustain,
        convertInputs(d.child!.inputs),
        d.child!.nickname,
        d.child!.keyboardDriver
      );
      const newConfig = new AdapterDeviceConfig(
        d.name,
        d.siblingIndex,
        newChild
      );

      configs.push(newConfig);
    } else if (d instanceof V3SupportedDeviceConfig) {
      const newConfig = new SupportedDeviceConfig(
        d.name,
        d.siblingIndex,
        d.shareSustain,
        convertInputs(d.inputs),
        d.nickname,
        d.keyboardDriver
      );
      configs.push(newConfig);
    } else {
      const newConfig = new AnonymousDeviceConfig(
        d.name,
        d.siblingIndex,
        (d as V2AnonymousConfig).overrides,
        d.shareSustain,
        d.nickname
      );
      configs.push(newConfig);
    }
  });

  const newProject = new Project(configs, Project.CURRENT_VERSION);
  return stringify(newProject);
}
