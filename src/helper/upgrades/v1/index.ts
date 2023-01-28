/* eslint-disable new-cap */
// v1 imports
import { Project as v1Project } from '@shared/project';
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
    i.number,
    i.channel,
    i.value
  );

  const onColor = i.colorForState('on') || i.defaultColor || null;
  const offColor = i.colorForState('off') || i.defaultColor || null;
  const steps = new Map<number, number[]>();

  if (onColor) {
    const upgradedOnColor = {
      ...onColor,
      fx: [],
    };
    const onImpl = new v1ColorImpl(
      upgradedOnColor,
      i.default.number,
      i.default.channel
    );
    steps.set(1, onImpl.toMidiArray());
  }

  if (offColor) {
    const upgradedOffColor = {
      ...offColor,
      fx: [],
    };
    const offImpl = new v1ColorImpl(
      upgradedOffColor,
      i.default.number,
      i.default.channel
    );
    steps.set(0, offImpl.toMidiArray());
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
    const impl = new v1ColorImpl(upgraded, i.default.number, i.default.channel);

    availableColors.push(impl);
  });

  return new v1InputConfig(
    i.default,
    availableColors,
    i.overrideable,
    i.type,
    i.value,
    outputPropagator,
    devicePropagator,
    i.nickname
  );
}

export function upgradeToV1(projectString: string) {
  const project = v0Project.fromJSON(projectString);
  const upgradedConfigs: (v1AnonymousDeviceConfig | v1SupportedDeviceConfig)[] =
    [];

  // upgrade supported devices
  project.devices
    .filter((c) => c instanceof v0SupportedDeviceConfig)
    .forEach((config) => {
      // update keyboard driver, I guess
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

      upgradedConfigs.push(upgradedConfig);
    });

  // upgrade anonymous devices
  project.devices
    .filter((c) => c instanceof v0AnonymousDeviceConfig)
    .forEach((c) => {
      const asAnon = c as v0AnonymousDeviceConfig;

      const upgraded = new v1AnonymousDeviceConfig(
        asAnon.name,
        asAnon.siblingIndex,
        asAnon.overrides,
        asAnon.shareSustain,
        asAnon.nickname
      );

      upgradedConfigs.push(upgraded);
    });

  const upgradedProject = new v1Project(upgradedConfigs);
  upgradedProject.version = 1;

  return upgradedProject.toJSON(false);
}
