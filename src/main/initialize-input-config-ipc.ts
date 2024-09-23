import { ipcMain, IpcMainEvent } from 'electron';

import {
  MonoInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import {
  BaseInputConfig,
  InputDTO,
} from '@shared/hardware-config/input-config/base-input-config';
import { Registry } from '@plugins/registry';

import { INPUT_CONFIG } from './ipc-channels';
import { ProjectProvider } from './project-provider';
import { wp } from './window-provider';

const { MainWindow } = wp;

ipcMain.on(
  INPUT_CONFIG.REMOVE_PLUGIN,
  (
    _e: IpcMainEvent,
    pluginId: string,
    deviceConfigId: string,
    inputId: string
  ) => {
    const { project } = ProjectProvider;
    const deviceConfig = project.getDevice(deviceConfigId);

    if (deviceConfig) {
      const asSupported = deviceConfig as SupportedDeviceConfig;
      const inputConfig = asSupported.getInputById(inputId);

      if (inputConfig && inputConfig instanceof MonoInputConfig) {
        inputConfig.plugins = inputConfig.plugins.filter((p) => p !== pluginId);
        Registry.deregister(pluginId);

        MainWindow.sendInputConfig(
          deviceConfigId,
          inputId,
          inputConfig.toDTO()
        );
      }
    }
  }
);

ipcMain.on(
  INPUT_CONFIG.GET_INPUT_CONFIG,
  (e, deviceId: string, inputId: string) => {
    let result: InputDTO | undefined;
    const { project } = ProjectProvider;
    const deviceConfig = project.getDevice(deviceId);

    if (deviceConfig instanceof SupportedDeviceConfig) {
      const inputConfig = deviceConfig.getInputById(inputId);

      if (inputConfig) {
        result = inputConfig.toDTO();
      }
    }

    e.returnValue = result;
  }
);

ipcMain.on(
  INPUT_CONFIG.UPDATE_INPUT,
  (_e: IpcMainEvent, deviceId: string, configs: InputDTO[]) => {
    const { project } = ProjectProvider;
    const deviceConfig = project.getDevice(deviceId) as SupportedDeviceConfig;

    const updatedConfigs: BaseInputConfig[] = [];
    configs.forEach((c) => {
      const input = deviceConfig.getInputById(c.id);

      if (input) {
        input.applyStub(c);
        updatedConfigs.push(input);

        console.log('sanity');
        MainWindow.sendInputState(deviceId, c.id, input.state);
        MainWindow.sendInputConfig(deviceId, c.id, c);
      }
    });

    MainWindow.edited = true;
  }
);
