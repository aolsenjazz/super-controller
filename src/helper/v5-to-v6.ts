import { BaseUpgrade } from './common/base-upgrade';

import { parse as v5Parse } from './legacy/v5/shared/util';
import { Project as V5Project } from './legacy/v5/shared/project';
import {
  AdapterDeviceConfig as V5AdapterDeviceConfig,
  SupportedDeviceConfig as V5SupportedDeviceConfig,
  AnonymousDeviceConfig as V5AnonymousDeviceConfig,
  DeviceConfig as V5DeviceConfig,
  BaseInputConfig as V5BaseInputConfig,
  LightCapableInputConfig,
} from './legacy/v5/shared/hardware-config';

import { DeviceConfig } from './legacy/v6/shared/hardware-config/device-config';
import { SupportedDeviceConfig } from './legacy/v6/shared/hardware-config/supported-device-config';
import { AdapterDeviceConfig } from './legacy/v6/shared/hardware-config/adapter-device-config';
import { ProjectPOJO } from './legacy/v6/shared/project-pojo';
import { BasePlugin } from './legacy/v6/plugins/core/base-plugin';
import { AnonymousDeviceConfig } from './legacy/v6/shared/hardware-config/anonymous-device-config';
import ShareSustainPlugin from './legacy/v6/plugins/device-plugins/share-sustain/index';
import TranslatorPlugin from './legacy/v6/plugins/device-plugins/translator';
import { toString } from './legacy/v6/plugins/device-plugins/translator/util';
import { DRIVERS } from './legacy/v6/shared/drivers';
import { inputConfigsFromDriver } from './legacy/v6/shared/hardware-config/input-config';
import { InteractiveInputDriver } from './legacy/v5/shared/driver-types';
import { inputIdFromDriver } from './legacy/v6/shared/util';
import { BaseInputConfig, MonoInputConfig } from './legacy/v6/plugins/types';
import BacklightControlPlugin, {
  BacklightControlDTO,
} from './legacy/v6/plugins/input-plugins/backlight-control';
import { MonoInteractiveDriver } from './legacy/v6/plugins/types';
import { generateId } from './legacy/v6/plugins/core/plugin-utils';

const VERSION = 6;

function findInputDriver(deviceName: string, inputId: string) {
  const parentDriver = DRIVERS.get(deviceName);

  if (!parentDriver)
    throw new Error(`unable to locate driver for id ${deviceName}`);

  const inputDriver = parentDriver.inputGrids
    .flatMap((g) => g.inputs)
    .filter((d) => d.interactive === true)
    .map((i) => i as InteractiveInputDriver)
    .find((d) => {
      return inputIdFromDriver(d) === inputId;
    });

  return inputDriver;
}

function createBacklightPlugin(
  old: LightCapableInputConfig,
  config: MonoInputConfig,
  driver: MonoInteractiveDriver
) {
  const colorBindings: BacklightControlDTO['colorBindings'] = {};
  old.devicePropagator.colorBindings.forEach((v, k) => {
    colorBindings[k] = v;
  });

  const fxBindings: BacklightControlDTO['fxBindings'] = {};
  const fxValueBindings: BacklightControlDTO['fxValueBindings'] = {};
  old.devicePropagator.fxBindings.forEach((_v, k) => {
    const fx = old.getFx(k);
    const fxVal = old.getFxVal(k);
    if (fx) {
      fxBindings[k] = fx;
    }

    if (fxVal) {
      fxValueBindings[k] = fxVal;
    }
  });

  const dto: BacklightControlDTO = {
    colorBindings,
    fxBindings,
    fxValueBindings,
    availableColors: old.availableColors,
    availableFx: old.availableFx,
    availableStates: [0, 1],
    collapsed: false,
    description: 'Control the light of this input.',
    // deliberately leave this unset; it wont get set in applyDTO()
    // elligibleOutputStrategies: []
    id: generateId('Backlight Control'),
    on: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    outputResponse: old.devicePropagator.outputResponse as any,
    parentId: config.qualifiedId,
    state: 0,
    title: 'Backlight Control',
    type: 'input',
  } as unknown as BacklightControlDTO;

  const p = new BacklightControlPlugin(
    dto.parentId,
    driver as MonoInteractiveDriver,
    dto
  );

  return p;
}

function upgradeInput(
  deviceId: string,
  deviceName: string,
  config: V5BaseInputConfig,
  plugins: BasePlugin[]
): BaseInputConfig[] | undefined {
  const driver = findInputDriver(deviceName, config.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  // for some reason I guess I was creating input configs for noninteractive inputs :)
  if (driver) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newConfigs = inputConfigsFromDriver(deviceId, driver as any);

    if (config instanceof LightCapableInputConfig && newConfigs.length === 1) {
      const plugin = createBacklightPlugin(
        config,
        newConfigs[0] as MonoInputConfig,
        driver as MonoInteractiveDriver
      );
      plugins.push(plugin);
      (newConfigs[0] as MonoInputConfig).plugins.push(plugin.id);
    }
    // color config plugin
    // override plugin

    return newConfigs;
  }

  return undefined;
}

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

  d.inputs.forEach((i) => {
    const newInputs = upgradeInput(config.id, config.portName, i, plugins);

    if (newInputs && newInputs.length > 0) inputs.push(...newInputs);
  });

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
      const msg = JSON.parse(k).args[0];
      const msgAsStr = toString(msg);

      translator.overrides[msgAsStr] = v.array;
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
