import { BaseUpgrade } from './common/base-upgrade';

import { parse as v5Parse } from './legacy/v5/shared/util';
import { Project as V5Project } from './legacy/v5/shared/project';
import {
  AdapterDeviceConfig as V5AdapterDeviceConfig,
  SupportedDeviceConfig as V5SupportedDeviceConfig,
  AnonymousDeviceConfig as V5AnonymousDeviceConfig,
  DeviceConfig as V5DeviceConfig,
} from './legacy/v5/shared/hardware-config';

import { DeviceConfig } from './legacy/v6/shared/hardware-config/device-config';
import { SupportedDeviceConfig } from './legacy/v6/shared/hardware-config/supported-device-config';
import { AdapterDeviceConfig } from './legacy/v6/shared/hardware-config/adapter-device-config';
import { ProjectPOJO } from './legacy/v6/shared/project-pojo';
import { BasePlugin } from './legacy/v6/plugins/core/base-plugin';
import { BaseInputConfig } from './legacy/v6/shared/hardware-config/input-config/base-input-config';
import { AnonymousDeviceConfig } from './legacy/v6/shared/hardware-config/anonymous-device-config';
import ShareSustainPlugin from './legacy/v6/plugins/device-plugins/share-sustain/index';
import TranslatorPlugin from './legacy/v6/plugins/device-plugins/translator';
import { toString } from './legacy/v6/plugins/device-plugins/translator/util';

const VERSION = 6;

function upgradeSupportedDevice(
  d: V5SupportedDeviceConfig,
  plugins: BasePlugin[],
  inputs: BaseInputConfig[]
): SupportedDeviceConfig {
  const config = new SupportedDeviceConfig(
    d.portName,
    d.driverName,
    d.siblingIndex,
    d.nickname
  );

  if (d.shareSustain.length > 0) {
    const shareSustain = new ShareSustainPlugin(config.id, d.shareSustain);
    plugins.push(shareSustain);
    config.plugins.push(shareSustain.id);
  }

  // TODO: iterate over inputs, create, add to inputs

  return config;
}

function upgradeAnonymousDevice(
  d: V5AnonymousDeviceConfig,
  plugins: BasePlugin[]
): AnonymousDeviceConfig {
  const config = new AnonymousDeviceConfig(
    d.portName,
    d.siblingIndex,
    d.nickname,
    []
  );

  if (d.shareSustain.length > 0) {
    const shareSustain = new ShareSustainPlugin(config.id, d.shareSustain);
    plugins.push(shareSustain);
    config.plugins.push(shareSustain.id);
  }

  if (d.overrides.size > 0) {
    const translator = new TranslatorPlugin(config.id);

    d.overrides.forEach((v, k) => {
      const msg = JSON.parse(k);
      const msgAsStr = toString(msg);

      translator.overrides[msgAsStr] = v;
    });

    plugins.push(translator);
    config.plugins.push(translator.id);
  }

  return config;
}

function upgradeAdapterDevice(
  d: V5AdapterDeviceConfig,
  plugins: BasePlugin[],
  inputs: BaseInputConfig[]
): AdapterDeviceConfig {
  const oldChild = d.child!;
  const newChild = upgradeSupportedDevice(oldChild, plugins, inputs);

  const config = new AdapterDeviceConfig(
    d.portName,
    d.driverName,
    d.siblingIndex,
    newChild
  );

  if (d.shareSustain.length > 0) {
    const shareSustain = new ShareSustainPlugin(config.id, d.shareSustain);
    plugins.push(shareSustain);
    config.plugins.push(shareSustain.id);
  }

  return config;
}

function upgradeDeviceConfig(
  d: V5DeviceConfig
): [DeviceConfig, BasePlugin[], BaseInputConfig[]] {
  let newDev: DeviceConfig;
  const plugins: BasePlugin[] = [];
  const inputs: BaseInputConfig[] = [];

  if (d instanceof V5AnonymousDeviceConfig) {
    newDev = upgradeAnonymousDevice(d, plugins);
  } else if (d instanceof V5SupportedDeviceConfig) {
    newDev = upgradeSupportedDevice(d, plugins, inputs);
  } else if (d instanceof V5AdapterDeviceConfig) {
    newDev = upgradeAdapterDevice(d, plugins, inputs);
  } else {
    throw new Error();
  }

  return [newDev, plugins, inputs];
}

function upgradeToV6(projString: string) {
  const oldProj = v5Parse<V5Project>(projString);

  const devices: DeviceConfig[] = [];
  const inputs: BaseInputConfig[] = [];
  const plugins: BasePlugin[] = [];

  oldProj.devices.forEach((d) => {
    const [newDevice, newPlugins, newInputs] = upgradeDeviceConfig(d);

    inputs.push(...newInputs);
    plugins.push(...newPlugins);
    devices.push(newDevice);
  });

  const newProj: ProjectPOJO = {
    devices: devices.map((d) => d.toDTO()),
    inputs: inputs.map((i) => i.toDTO()),
    plugins: plugins.map((p) => p.toDTO()),
    version: VERSION,
  };

  return JSON.stringify(newProj);
}

export class V5ToV6 extends BaseUpgrade {
  applyUpgrade(v5ProjectString: string) {
    return upgradeToV6(v5ProjectString);
  }

  rollback(freshProjectString: string) {
    return freshProjectString;
  }

  verify(): void {
    throw new Error('cant be arsed');
  }
}
