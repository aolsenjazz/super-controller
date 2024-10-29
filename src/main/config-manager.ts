import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';
import { Anonymous, DRIVERS, getDriver } from '@shared/drivers';
import { configFromDriver } from '@shared/hardware-config';
import { AdapterDeviceConfig } from '@shared/hardware-config/adapter-device-config';
import { inputConfigsFromDriver } from '@shared/hardware-config/input-config';
import { BaseInputConfig } from '@shared/hardware-config/input-config/base-input-config';
import { SupportedDeviceConfig } from '@shared/hardware-config/supported-device-config';
import { BaseDevicePlugin } from '@plugins/core/base-device-plugin';
import { BaseInputPlugin } from '@plugins/core/base-input-plugin';
import { BasePluginManifest } from '@plugins/core/base-plugin-manifest';
import { InputPluginManifest } from '@plugins/core/input-plugin-manifest';
import { getQualifiedInputId } from '@shared/util';

import { DeviceRegistry } from './registry/device-registry';
import { InputRegistry } from './registry/input-registry';
import { PluginRegistry } from './registry/plugin-registry';
import { HardwarePortService } from './port-service';
import { VirtualPortService } from './port-service/virtual/virtual-port-service';
import { WindowProvider } from './window-provider';
import { RendererInclusivePluginProvider } from './renderer-inclusive-plugin-provider';
import { getDevicePlugin, getInputPlugin } from './plugin-files';

const { MainWindow } = WindowProvider;

class ConfigManagerClass {
  private static instance: ConfigManagerClass;

  static getInstance() {
    if (!ConfigManagerClass.instance) {
      ConfigManagerClass.instance = new ConfigManagerClass();
    }

    return ConfigManagerClass.instance;
  }

  public addDeviceConfig(
    deviceName: string,
    siblingIdx: number,
    driverName?: string,
  ) {
    const driver = getDriver(driverName || deviceName) || Anonymous;
    const config = configFromDriver(deviceName, siblingIdx, driver);
    DeviceRegistry.register(config.id, config);

    // add default plugins
    config.initDefaultPlugins(RendererInclusivePluginProvider);

    // update port services
    HardwarePortService.onConfigChange({ action: 'add', changed: [config] });
    VirtualPortService.onConfigChange({ action: 'add', changed: [config] });

    // tell the frontend about the new config
    const allDevices = DeviceRegistry.getAll().map((c) => c.toDTO());
    MainWindow.setConfiguredDevices(allDevices);

    // create, register, notify frontend of, new configs
    if (config instanceof SupportedDeviceConfig) {
      this.addInputConfigs(config);
    }

    MainWindow.edited = true;
  }

  public async addDevicePlugin(deviceId: string, m: BasePluginManifest) {
    const dev = DeviceRegistry.get(deviceId);

    if (!dev) throw new Error(`No config available for deviceId[${deviceId}]`);

    // Dynamically import plugin module, instantiate, register
    const Plugin = getDevicePlugin(m.title);
    const plugin: BaseDevicePlugin = new Plugin(deviceId);

    // TODO: should at a .addPLugin function to device configs to handle this case
    if (dev instanceof AdapterDeviceConfig) {
      dev.child!.plugins.push(plugin.id);
    } else {
      dev.plugins.push(plugin.id);
    }

    PluginRegistry.register(plugin.id, plugin);

    // Tell the frontend
    MainWindow.upsertPlugin(plugin.toDTO());
    MainWindow.upsertConfiguredDevice(dev.toDTO());

    MainWindow.edited = true;
  }

  public removeDevicePlugin(deviceId: string, pluginId: string) {
    const config = DeviceRegistry.get(deviceId);

    if (config) {
      if (config instanceof AdapterDeviceConfig) {
        config.child!.plugins = config.child!.plugins.filter(
          (p) => p !== pluginId,
        );
      } else {
        config.plugins = config.plugins.filter((p) => p !== pluginId);
      }

      PluginRegistry.deregister(pluginId);

      const allDevices = DeviceRegistry.getAll().map((c) => c.toDTO());
      MainWindow.setConfiguredDevices(allDevices);

      MainWindow.edited = true;
    }
  }

  public removeInputPlugin(qualifiedInputId: string, pluginId: string) {
    const inputConfig = InputRegistry.get(qualifiedInputId);

    if (!inputConfig)
      throw new Error(`no such config for id ${qualifiedInputId}`);

    inputConfig.removePlugin(pluginId);

    PluginRegistry.deregister(pluginId);
    MainWindow.upsertInputConfig(inputConfig.toDTO());

    MainWindow.edited = true;
  }

  public setAdapterChild(deviceId: string, childDriverName: string) {
    const config = DeviceRegistry.get<AdapterDeviceConfig>(deviceId);
    const driver = DRIVERS.get(childDriverName);

    if (!config) throw new Error(`No config found fr ${deviceId}`);
    if (!driver) throw new Error(`No driver found for ${childDriverName}`);

    const child = configFromDriver(childDriverName, 0, driver);

    if (!(child instanceof SupportedDeviceConfig))
      throw new Error(
        'cannot assign a non-supported config to an adapter child',
      );

    config.setChild(child);
    this.addInputConfigs(child, deviceId);

    MainWindow.edited = true;
    MainWindow.upsertConfiguredDevice(config.toDTO());
  }

  public removeDevice(id: string) {
    const config = DeviceRegistry.get(id)!;

    // deregister input configs + child plugins
    if (
      config instanceof SupportedDeviceConfig ||
      config instanceof AdapterDeviceConfig
    ) {
      const inputs = config.inputs
        .map((i) => getQualifiedInputId(config.id, i))
        .map((qid) => InputRegistry.get(qid)!);
      this.removeInputConfigs(inputs);
    }

    DeviceRegistry.deregister(config.id);

    // update port services
    HardwarePortService.onConfigChange({ action: 'remove', changed: [config] });
    VirtualPortService.onConfigChange({ action: 'remove', changed: [config] });

    // tell the frontend about the removed config
    const devices = DeviceRegistry.getAll().map((c) => c.toDTO());
    MainWindow.setConfiguredDevices(devices);

    MainWindow.edited = true;
  }

  public async addInputPlugin(
    qualifiedInputId: string,
    m: InputPluginManifest,
  ) {
    const input = InputRegistry.get(qualifiedInputId);

    if (!input) throw new Error(`Adding plugin to ${input} is not defined`);

    const inputDriver = input.driver;
    const Plugin = getInputPlugin(m.title);
    const plugin: BaseInputPlugin = new Plugin(qualifiedInputId, inputDriver);
    input.addPlugin(plugin.id);

    PluginRegistry.register(plugin.id, plugin);

    MainWindow.upsertPlugin(plugin.toDTO());
    MainWindow.upsertInputConfig(input.toDTO());

    MainWindow.edited = true;
  }

  /**
   * Create, registers all child inputs for the given `parentConfig`. Optionally,
   * `parentId` may be passed to this function to inform input configs that their
   * parent config is actually an adapter, useful for locating the correct config
   * when receiving messages from an adapter.
   */
  private addInputConfigs(
    parentConfig: SupportedDeviceConfig,
    parentId?: string,
  ) {
    const driver = DRIVERS.get(parentConfig.driverName)!;
    const inputs = driver.inputGrids
      .flatMap((g) => g.inputs)
      .filter((i) => i.interactive)
      .map((i) => i as InteractiveInputDriver)
      .map((d) => inputConfigsFromDriver(parentId || parentConfig.id, d))
      .flatMap((i) => i);

    // register input, add to parent
    inputs.forEach((c) => {
      InputRegistry.register(c.qualifiedId, c);
      parentConfig.inputs.push(c.id);
      c.initDefaultPlugins(RendererInclusivePluginProvider);
    });

    // send to main window
    const inputDTOs = inputs.map((i) => i.toDTO());
    MainWindow.upsertInputConfigs(inputDTOs);
  }

  private removeInputConfigs(configs: BaseInputConfig[]) {
    // deregister, remove, update frontend of, plugins
    const pluginIds: string[] = [];

    configs.forEach((i) => {
      i.getPlugins().forEach((p) => {
        PluginRegistry.deregister(p);
        pluginIds.push(p);
      });
    });

    MainWindow.removePlugins(pluginIds);

    // deregister inputs, notify frontend
    configs.forEach((i) => InputRegistry.deregister(i));
    const qids = configs.map((c) => c.qualifiedId);
    MainWindow.removeInputs(qids);
  }
}

export const ConfigManager = ConfigManagerClass.getInstance();
