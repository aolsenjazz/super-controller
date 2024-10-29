import {
  AdapterDeviceConfig,
  AnonymousDeviceConfig,
  BaseInputConfig,
  SupportedDeviceConfig,
} from './legacy/v5/shared/hardware-config';

import {
  KnobConfig,
  PadConfig,
  PitchbendConfig,
  SliderConfig,
  SwitchConfig,
  XYConfig,
} from './legacy/v5/shared/hardware-config/input-config';

import { create, MidiArray } from './legacy/v5/shared/midi-array';

import {
  ColorConfigPropagator,
  ConstantPropagator,
  ContinuousPropagator,
  GatePropagator,
  NonsequentialStepPropagator,
  OverrideablePropagator,
  PitchbendPropagator,
} from './legacy/v5/shared/propagators';
import { TogglePropagator } from './legacy/v5/shared/propagators/toggle-propagator';

import { Project } from './legacy/v5/shared/project';

import { BaseUpgrade } from './common/base-upgrade';

import { Project as V4Project } from './legacy/v4/shared/project';
import { stringify, parse } from './legacy/v4/shared/util';
import {
  SupportedDeviceConfig as V4SupportedDeviceConfig,
  AdapterDeviceConfig as V4AdapterDeviceConfig,
  AnonymousDeviceConfig as V4AnonymousDeviceConfig,
  BaseInputConfig as V4BaseInputConfig,
} from './legacy/v4/shared/hardware-config';
import {
  KnobConfig as V4KnobConfig,
  PadConfig as V4PadConfig,
  PitchbendConfig as V4PitchbendConfig,
  SliderConfig as V4SliderConfig,
  SwitchConfig as V4SwitchConfig,
  XYConfig as V4XYConfig,
} from './legacy/v4/shared/hardware-config/input-config';
import {
  ColorConfigPropagator as V4ColorConfigPropagator,
  ConstantPropagator as V4ConstantPropagator,
  ContinuousPropagator as V4ContinuousPropagator,
  GatePropagator as V4GatePropagator,
  NonsequentialStepPropagator as V4NonsequentialStepPropagator,
  OverrideablePropagator as V4OverrideablePropagator,
  PitchbendPropagator as V4PitchbendPropagator,
} from './legacy/v4/shared/propagators';
import { TogglePropagator as V4TogglePropagator } from './legacy/v4/shared/propagators/toggle-propagator';
import { InputResponse } from './legacy/v4/shared/driver-types';

function convertDeviceProp(d: V4ColorConfigPropagator): ColorConfigPropagator {
  const {
    colorBindings,
    fxBindings,
    defaultColor,
    defaultFx,
    currentStep,
    hardwareResponse,
    outputResponse,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = d as any;

  return new ColorConfigPropagator(
    hardwareResponse,
    outputResponse,
    defaultColor,
    defaultFx,
    colorBindings,
    fxBindings,
    currentStep,
  );
}

function convertOutputProp<
  T extends
    | OverrideablePropagator<InputResponse, InputResponse>
    | NonsequentialStepPropagator,
>(o: V4OverrideablePropagator<InputResponse, InputResponse>): T {
  const { outputResponse } = o;

  const { statusString, number, channel, value } = o;

  if (o instanceof V4TogglePropagator) {
    return new TogglePropagator(
      outputResponse as 'toggle' | 'constant',
      statusString,
      number,
      channel,
      value,
    ) as unknown as T;
  }

  if (o instanceof V4PitchbendPropagator) {
    return new PitchbendPropagator(
      outputResponse as 'continuous' | 'constant',
      statusString,
      number,
      channel,
    ) as unknown as T;
  }

  if (o instanceof V4NonsequentialStepPropagator) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { steps, defaultStep } = o as any;
    return new NonsequentialStepPropagator(steps, defaultStep) as unknown as T;
  }

  if (o instanceof V4GatePropagator) {
    const { state } = o;
    return new GatePropagator(
      outputResponse as 'constant' | 'toggle' | 'gate',
      statusString,
      number,
      channel,
      value,
      state,
    ) as unknown as T;
  }

  if (o instanceof V4ContinuousPropagator) {
    const { knobType, valueType } = o;
    return new ContinuousPropagator(
      outputResponse as 'constant' | 'continuous',
      statusString,
      number,
      channel,
      value,
      knobType,
      valueType,
    ) as unknown as T;
  }

  if (o instanceof V4ConstantPropagator) {
    const { state } = o;
    return new ConstantPropagator(
      outputResponse as 'constant' | 'toggle',
      statusString,
      number,
      channel,
      value,
      state,
    ) as unknown as T;
  }

  throw new Error();
}

function convertInput(i: V4BaseInputConfig): BaseInputConfig {
  if (i instanceof V4KnobConfig) {
    const { defaults, outputPropagator, knobType, nickname } = i;

    const newDefaults = {
      ...defaults,
      knobType,
    };

    return new KnobConfig(
      newDefaults,
      convertOutputProp(outputPropagator) as ContinuousPropagator,
      nickname,
    );
  }

  if (i instanceof V4PadConfig) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { devicePropagator } = i as any;

    const {
      defaults,
      availableColors,
      availableFx,
      outputPropagator,
      defaultValue,
      nickname,
    } = i;

    return new PadConfig(
      defaults,
      availableColors,
      availableFx,
      convertOutputProp(outputPropagator),
      convertDeviceProp(devicePropagator),
      defaultValue,
      nickname,
    );
  }

  if (i instanceof V4PitchbendConfig) {
    const { defaults, outputPropagator, nickname } = i;
    return new PitchbendConfig(
      defaults,
      convertOutputProp(outputPropagator),
      nickname,
    );
  }

  if (i instanceof V4SliderConfig) {
    const { defaults, outputPropagator, nickname } = i;
    return new SliderConfig(
      defaults,
      convertOutputProp(outputPropagator),
      nickname,
    );
  }

  if (i instanceof V4SwitchConfig) {
    const { outputPropagator, nickname } = i;
    return new SwitchConfig(convertOutputProp(outputPropagator), nickname);
  }

  if (i instanceof V4XYConfig) {
    const { x, y, nickname } = i;
    return new XYConfig(
      convertInput(x) as SliderConfig,
      convertInput(y) as SliderConfig,
      nickname,
    );
  }

  throw new Error();
}

function convertAnonymous(d: V4AnonymousDeviceConfig): AnonymousDeviceConfig {
  const { name, siblingIndex, nickname, shareSustain, overrides } = d;

  const newOverrides = new Map<string, MidiArray>();
  Array.from(overrides.keys()).forEach((k) => {
    const oldArr = overrides.get(k)!;
    const newArr = create(oldArr);
    newOverrides.set(k, newArr);
  });

  const newConf = new AnonymousDeviceConfig(
    name,
    siblingIndex,
    newOverrides,
    shareSustain,
    nickname,
  );

  return newConf;
}

function convertSupported(d: V4SupportedDeviceConfig): SupportedDeviceConfig {
  const { name, siblingIndex, shareSustain, inputs, nickname, keyboardDriver } =
    d;

  const newInputs = inputs.map((i) => {
    return convertInput(i);
  });

  const newConf = new SupportedDeviceConfig(
    name,
    name,
    siblingIndex,
    shareSustain,
    newInputs,
    nickname,
    keyboardDriver,
  );
  return newConf;
}

function convertAdapter(d: V4AdapterDeviceConfig): AdapterDeviceConfig {
  const { name, siblingIndex, child } = d;

  const newChild = child ? convertSupported(child) : undefined;

  const newConf = new AdapterDeviceConfig(name, name, siblingIndex, newChild);
  return newConf;
}

export function upgradeToV5(projectString: string) {
  const oldProj = parse<V4Project>(projectString);

  const newDevices = oldProj.devices.map((d) => {
    if (d instanceof V4SupportedDeviceConfig) {
      return convertSupported(d);
    }
    if (d instanceof V4AdapterDeviceConfig) {
      return convertAdapter(d);
    }
    if (d instanceof V4AnonymousDeviceConfig) {
      return convertAnonymous(d);
    }

    throw new Error();
  });

  const newProj = new Project(newDevices);
  return stringify(newProj);
}

export class V4ToV5 extends BaseUpgrade {
  applyUpgrade(v4ProjectString: string) {
    return upgradeToV5(v4ProjectString);
  }

  rollback(freshProjectString: string) {
    return freshProjectString;
  }

  verify(): void {
    throw new Error('cant be arsed');
  }
}
