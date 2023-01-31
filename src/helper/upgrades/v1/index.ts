/* eslint-disable new-cap */
// v1 imports
import { MidiArray } from '@shared/midi-array';
import { Project as v1Project } from '@shared/project';
import { Color } from '@shared/driver-types';
import {
  InputConfig as v1InputConfig,
  ColorImpl as v1ColorImpl,
  SupportedDeviceConfig as v1SupportedDeviceConfig,
  AnonymousDeviceConfig as v1AnonymousDeviceConfig,
} from '@shared/hardware-config';
import {
  OutputPropagator as v1OutputPropagator,
  NStepPropagator as v1NStepPropagator,
} from '@shared/propagators';

// v0 imports
import { Project as v0Project } from './project';
import {
  SupportedDeviceConfig as v0SupportedDeviceConfig,
  AnonymousDeviceConfig as v0AnonymousDeviceConfig,
  InputConfig as v0InputConfig,
} from './hardware-config';

function upgradeInput(i: v0InputConfig) {
  const outputPropagator = new v1OutputPropagator(
    i.default.response,
    i.response,
    i.eventType,
    i.number as MidiNumber,
    i.channel,
    i.value as MidiNumber
  );

  const onColor = i.colorForState('on') || i.defaultColor || null;
  const offColor = i.colorForState('off') || i.defaultColor || null;
  const steps = new Map<number, MidiArray>();

  if (onColor) {
    const upgradedOnColor = {
      ...onColor,
      fx: [],
    };
    const onImpl = v1ColorImpl.fromDrivers(
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
    const offImpl = v1ColorImpl.fromDrivers(
      upgradedOffColor as Color,
      i.default.number as MidiNumber,
      i.default.channel
    );
    steps.set(0, offImpl);
  }

  const devicePropagator = new v1NStepPropagator(
    i.default.response,
    i.response,
    steps
  );

  const availableColors: v1ColorImpl[] = [];
  i.availableColors.forEach((c) => {
    const upgraded = {
      ...c,
      fx: [],
    };
    const impl = v1ColorImpl.fromDrivers(
      upgraded as Color,
      i.default.number as MidiNumber,
      i.default.channel
    );

    availableColors.push(impl);
  });

  return new v1InputConfig(
    i.default as v1InputConfig['default'],
    availableColors,
    i.overrideable,
    i.type,
    i.value as MidiNumber,
    outputPropagator,
    devicePropagator,
    i.nickname
  );
}

// function upgradeInputIds(config: v1SupportedDeviceConfig) {
//   let id = -1;
//   config.inputs.forEach((i) => {
//     if (i.number < 0) {
//       i.number = id;
//       id -= 1;
//     }
//   });
// }

export function upgradeToV1(projectString: string) {
  const project = v0Project.fromJSON(projectString);
  const upgradedConfigs: (v1AnonymousDeviceConfig | v1SupportedDeviceConfig)[] =
    [];

  // upgrade supported devices
  project.devices
    .filter((c) => c instanceof v0SupportedDeviceConfig)
    .forEach((config) => {
      const casted = config as v0SupportedDeviceConfig;

      const upgradedInputs = casted.inputs.map((i) => upgradeInput(i));

      const upgradedConfig = new v1SupportedDeviceConfig(
        config.name,
        config.siblingIndex,
        config.shareSustain,
        upgradedInputs,
        undefined,
        config.keyboardDriver
      );

      // upgradeInputIds(upgradedConfig);

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

      const upgraded = new v1AnonymousDeviceConfig(
        asAnon.name,
        asAnon.siblingIndex,
        overrides,
        asAnon.shareSustain,
        asAnon.nickname
      );

      upgradedConfigs.push(upgraded);
    });

  const upgradedProject = new v1Project(upgradedConfigs);
  upgradedProject.version = 1;

  return upgradedProject.toJSON(false);
}
