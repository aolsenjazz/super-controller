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
  SwitchConfig as V5SwitchConfig,
} from './legacy/v5/shared/hardware-config';

import { DeviceConfig } from './legacy/v6/shared/hardware-config/device-config';
import { SupportedDeviceConfig } from './legacy/v6/shared/hardware-config/supported-device-config';
import { AdapterDeviceConfig } from './legacy/v6/shared/hardware-config/adapter-device-config';
import { ProjectPOJO } from './legacy/v6/shared/project-pojo';
import { BasePlugin, PluginDTO } from './legacy/v6/plugins/core/base-plugin';
import { AnonymousDeviceConfig } from './legacy/v6/shared/hardware-config/anonymous-device-config';
import ShareSustainPlugin from './legacy/v6/plugins/device-plugins/share-sustain/index';
import TranslatorPlugin from './legacy/v6/plugins/device-plugins/translator';
import { toString } from './legacy/v6/plugins/device-plugins/translator/util';
import { DRIVERS } from './legacy/v6/shared/drivers';
import { inputConfigsFromDriver } from './legacy/v6/shared/hardware-config/input-config';
import { InteractiveInputDriver } from './legacy/v5/shared/driver-types';
import {
  getQualifiedInputId,
  inputIdFromDriver,
} from './legacy/v6/shared/util';
import {
  BaseInputConfig,
  DeviceConfigDTO,
  MonoInteractiveDriver,
} from './legacy/v6/plugins/types';
import BacklightControlPlugin, {
  BacklightControlDTO,
} from './legacy/v6/plugins/input-plugins/backlight-control';
import { generateId } from './legacy/v6/plugins/core/plugin-utils';
import BasicOverridePlugin, {
  BasicOverrideDTO,
} from './legacy/v6/plugins/input-plugins/basic-override';
import { MonoInputConfig as V5MonoInputConfig } from './legacy/v5/shared/hardware-config/input-config/mono-input-config';
import { MessageResolverDTO } from './legacy/v6/plugins/input-plugins/basic-override/message-resolver/message-resolver';
import { idForMsg, statusStringToNibble } from './legacy/v6/shared/midi-util';
import { InputDTO } from './legacy/v6/shared/hardware-config/input-config/base-input-config';
import { MonoInputConfig } from './legacy/v6/shared/hardware-config/input-config/mono-input-config';
import { SwitchConfig } from './legacy/v6/shared/hardware-config/input-config/switch-config';

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
  const defaultColor = driver.availableColors.find((c) => c.default === true);

  const colorBindings: BacklightControlDTO['colorBindings'] = {};
  colorBindings[0] = old.devicePropagator.colorBindings.get(0) || defaultColor!;
  colorBindings[1] = old.devicePropagator.colorBindings.get(1) || defaultColor!;

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

function onStep(old: V5MonoInputConfig, value?: number) {
  // init 1 step
  const { statusString, number, channel } = old.defaults;
  const parsedStatus =
    statusString === 'noteon/noteoff' ? 'noteon' : statusString;

  const {
    statusString: statusOverride,
    number: numberOverride,
    channel: channelOverride,
  } = old.outputPropagator;
  const parsedStatusOverride =
    statusOverride === 'noteon/noteoff' ? 'noteon' : statusOverride;

  return [
    [
      statusStringToNibble(parsedStatus) + channel,
      number,
      value === undefined ? old.value : value,
    ],
    [
      statusStringToNibble(parsedStatusOverride) + channelOverride,
      numberOverride,
      value === undefined ? old.outputPropagator.value : value,
    ],
  ];
}

function offStep(old: V5MonoInputConfig, value?: number) {
  // init 1 step
  const { statusString, number, channel } = old.defaults;
  const parsedStatus =
    statusString === 'noteon/noteoff' ? 'noteoff' : statusString;

  const {
    statusString: statusOverride,
    number: numberOverride,
    channel: channelOverride,
  } = old.outputPropagator;
  const parsedStatusOverride =
    statusOverride === 'noteon/noteoff' ? 'noteoff' : statusOverride;

  return [
    [
      statusStringToNibble(parsedStatus) + channel,
      number,
      value === undefined ? old.value : value,
    ],
    [
      statusStringToNibble(parsedStatusOverride) + channelOverride,
      numberOverride,
      value === undefined ? old.outputPropagator.value : value,
    ],
  ];
}

function createOverridePlugin(
  old: V5MonoInputConfig,
  config: MonoInputConfig,
  driver: MonoInteractiveDriver
): BasicOverridePlugin {
  let className: MessageResolverDTO['className'] = 'BinaryMessageResolver';

  if (old.response === 'continuous') className = 'ContinuousMessageResolver';
  if (old.defaults.response === 'toggle') className = 'BinaryMessageResolver';
  if (old.response === 'constant') className = 'DiscreteMessageResolver';

  const messageResolver = {
    className,
    // this won't be overwritten
    // eligibleStatuses: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  if (className === 'DiscreteMessageResolver') {
    if (old.response === 'constant') {
      const [defaultMsg, override] = onStep(old);

      messageResolver.defaults = {
        0: defaultMsg,
      };

      messageResolver.bindings = {
        0: override,
      };
    } else {
      // init 2 steps
      const [defaultMsg1, override1] = offStep(old, 0);
      const [defaultMsg2, override2] = onStep(old, 127);

      messageResolver.defaults = {
        0: defaultMsg1,
        1: defaultMsg2,
      };

      messageResolver.bindings = {
        0: override1,
        1: override2,
      };
    }
  } else if (old.defaults.statusString === 'pitchbend') {
    // pitchbend resolver dto fields
    messageResolver.statusOverride = old.outputPropagator.statusString;
    messageResolver.channelOverride = old.outputPropagator.channel;
  } else {
    // normal resolver dto fields
    messageResolver.statusOverride =
      old.outputPropagator.statusString || old.defaults.statusString;
    messageResolver.channelOverride =
      old.outputPropagator.channel || old.defaults.channel;
    messageResolver.numberOverride =
      old.outputPropagator.number || old.defaults.number;
    messageResolver.valueOverride = 127;
  }

  const dto: BasicOverrideDTO = {
    collapsed: false,
    description: 'Change the way this input sends messages.',
    // this won't be overwritten anyways
    // eligibleOutputStrategies: ,
    id: generateId('Input Overrides'),
    // again, this won't be overwritten
    messageResolver,
    on: true,
    outputStrategy: old.response,
    parentId: config.qualifiedId,
    title: 'Input Overrides',
    type: 'input',
  } as unknown as BasicOverrideDTO;

  const p = BasicOverridePlugin.fromDTO(dto, driver);

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

    if (
      config instanceof LightCapableInputConfig &&
      newConfigs.length === 1 &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (driver as any).availableColors.length > 0
    ) {
      const plugin = createBacklightPlugin(
        config,
        newConfigs[0] as MonoInputConfig,
        driver as MonoInteractiveDriver
      );
      plugins.push(plugin);
      (newConfigs[0] as MonoInputConfig).getPlugins().push(plugin.id);
    }

    newConfigs.forEach((newConfig) => {
      const plugin = createOverridePlugin(
        config as V5MonoInputConfig,
        newConfig as MonoInputConfig,
        driver as MonoInteractiveDriver
      );
      plugins.push(plugin);
      (newConfig as MonoInputConfig).getPlugins().push(plugin.id);
    });

    return newConfigs;
  }
  const outProp = (config as V5SwitchConfig).outputPropagator;
  const correctConfigId = `${idForMsg(outProp.defaultStep)}`;

  const d = findInputDriver(deviceName, correctConfigId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newConfigs = inputConfigsFromDriver(deviceId, d as any);

  const c = newConfigs[0] as unknown as SwitchConfig;
  c.steps.forEach((s) => {
    const override = new BasicOverridePlugin(s.qualifiedId, s.driver);
    s.getPlugins().push(override.id);
    plugins.push(override);
  });

  return newConfigs;
}

function upgradeSupportedDevice(
  d: V5SupportedDeviceConfig,
  plugins: BasePlugin[],
  inputs: BaseInputConfig[],
  configId?: string
): SupportedDeviceConfig {
  const config = new SupportedDeviceConfig(
    d.portName,
    d.driverName,
    d.siblingIndex,
    d.nickname
  );

  if (d.shareSustain.length > 0) {
    const shareSustain = new ShareSustainPlugin(
      config.id,
      undefined,
      d.shareSustain
    );
    plugins.push(shareSustain);
    config.plugins.push(shareSustain.id);
  }

  d.inputs.forEach((i) => {
    const newInputs = upgradeInput(
      configId || config.id,
      config.portName,
      i,
      plugins
    );

    if (newInputs && newInputs.length > 0) {
      inputs.push(...newInputs);
      config.inputs.push(...newInputs.map((inp) => inp.id));
    }
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
    const shareSustain = new ShareSustainPlugin(
      config.id,
      undefined,
      d.shareSustain
    );
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
  const newChild = upgradeSupportedDevice(oldChild, plugins, inputs, d.id);

  const config = new AdapterDeviceConfig(
    d.portName,
    d.driverName,
    d.siblingIndex,
    newChild
  );

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

  const devices: Record<string, DeviceConfig> = {};
  const inputs: Record<string, BaseInputConfig> = {};
  const plugins: Record<string, BasePlugin> = {};

  oldProj.devices.forEach((d) => {
    const [newDevice, newPlugins, newInputs] = upgradeDeviceConfig(d);

    newInputs.forEach((i) => {
      inputs[getQualifiedInputId(i.deviceId, i.id)] = i;
    });
    newPlugins.forEach((p) => {
      plugins[p.id] = p;
    });
    devices[newDevice.id] = newDevice;
  });

  const newProj: ProjectPOJO = {
    devices: Object.fromEntries(
      Object.entries(devices).map(
        ([key, device]) => [key, device.toDTO()] as [string, DeviceConfigDTO]
      )
    ),
    inputs: Object.fromEntries(
      Object.entries(inputs).map(
        ([key, input]) => [key, input.toDTO()] as [string, InputDTO]
      )
    ),
    plugins: Object.fromEntries(
      Object.entries(plugins).map(
        ([key, plugin]) => [key, plugin.toDTO()] as [string, PluginDTO]
      )
    ),
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
