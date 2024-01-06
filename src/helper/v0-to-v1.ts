import { BaseUpgrade } from './common/base-upgrade';

// v1 imports
import { MidiArray } from './legacy/v1/midi-array';
import { Project as V1Project } from './legacy/v1/project';
import { stringify } from './legacy/v1/util';
import { Color } from './legacy/v1/driver-types';
import {
  InputConfig as V1InputConfig,
  ColorImpl as V1ColorImpl,
  SupportedDeviceConfig as V1SupportedDeviceConfig,
  AnonymousDeviceConfig as V1AnonymousDeviceConfig,
} from './legacy/v1/hardware-config';
import {
  propagatorFromJSON,
  NStepPropagator as V1NStepPropagator,
} from './legacy/v1/propagators';

// v0 imports
import { Project as v0Project } from './legacy/v0/project';
import {
  SupportedDeviceConfig as v0SupportedDeviceConfig,
  AnonymousDeviceConfig as v0AnonymousDeviceConfig,
  InputConfig as v0InputConfig,
} from './legacy/v0/hardware-config';

function upgradeInput(i: v0InputConfig) {
  const outputPropagator = propagatorFromJSON(i.outputPropagator);

  const onColor = i.colorForState('on') || i.defaultColor || null;
  const offColor = i.colorForState('off') || i.defaultColor || null;
  const steps = new Map<number, MidiArray>();

  if (onColor) {
    const upgradedOnColor = {
      ...onColor,
      fx: [],
    };
    const onImpl = V1ColorImpl.fromDrivers(
      upgradedOnColor as Color,
      i.default.number as MidiNumber,
      i.default.channel
    );
    steps.set(1, onImpl);
  }

  if (offColor) {
    const upgradedOffColor = {
      ...offColor,
      fx: [],
    };
    const offImpl = V1ColorImpl.fromDrivers(
      upgradedOffColor as Color,
      i.default.number as MidiNumber,
      i.default.channel
    );
    steps.set(0, offImpl);
  }

  const devicePropagator = new V1NStepPropagator(
    i.default.response,
    i.response,
    steps
  );

  const availableColors: V1ColorImpl[] = [];
  i.availableColors.forEach((c) => {
    const upgraded = {
      ...c,
      fx: [],
    };
    const impl = V1ColorImpl.fromDrivers(
      upgraded as Color,
      i.default.number as MidiNumber,
      i.default.channel
    );

    availableColors.push(impl);
  });

  const knobType = i.type === 'knob' ? 'absolute' : undefined;

  return new V1InputConfig(
    i.default as V1InputConfig['default'],
    availableColors,
    [],
    i.overrideable,
    i.type,
    i.value as MidiNumber,
    outputPropagator,
    devicePropagator,
    knobType,
    undefined,
    i.nickname
  );
}

function upgradeInputIds(config: V1SupportedDeviceConfig) {
  let id = -1;
  config.inputs.forEach((i) => {
    if (i.number < 0) {
      i.number = id as MidiNumber;
      id -= 1;
    }
  });
}

export function upgradeToV1(projectString: string) {
  const project = v0Project.fromJSON(projectString);
  const upgradedConfigs: (V1AnonymousDeviceConfig | V1SupportedDeviceConfig)[] =
    [];

  // upgrade supported devices
  project.devices
    .filter((c) => c instanceof v0SupportedDeviceConfig)
    .forEach((config) => {
      const casted = config as v0SupportedDeviceConfig;

      const upgradedInputs = casted.inputs.map((i) => upgradeInput(i));

      const upgradedConfig = new V1SupportedDeviceConfig(
        config.name,
        config.siblingIndex,
        config.shareSustain,
        upgradedInputs,
        undefined,
        config.keyboardDriver
      );

      upgradeInputIds(upgradedConfig);

      upgradedConfigs.push(upgradedConfig);
    });

  // upgrade anonymous devices
  project.devices
    .filter((c) => c instanceof v0AnonymousDeviceConfig)
    .forEach((c) => {
      const asAnon = c as v0AnonymousDeviceConfig;

      const overrides = new Map<string, MidiArray>();
      Array.from(overrides.keys()).forEach((k) => {
        overrides.set(k, new MidiArray(asAnon.overrides.get(k)! as MidiTuple));
      });

      const upgraded = new V1AnonymousDeviceConfig(
        asAnon.name,
        asAnon.siblingIndex,
        overrides,
        asAnon.shareSustain,
        asAnon.nickname
      );

      upgradedConfigs.push(upgraded);
    });

  const upgradedProject = new V1Project(upgradedConfigs);
  upgradedProject.version = 1;
  return stringify(upgradedProject);
}

export class V0ToV1 extends BaseUpgrade {
  applyUpgrade(v0ProjectString: string) {
    return upgradeToV1(v0ProjectString);
  }

  rollback(freshProjectString: string) {
    return freshProjectString;
  }

  verify(): void {
    throw new Error('cant be arsed');
  }
}
