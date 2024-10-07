import { ipcMain, IpcMainEvent } from 'electron';

import { MonoInputConfig } from '@shared/hardware-config';
import {
  BaseInputConfig,
  InputDTO,
} from '@shared/hardware-config/input-config/base-input-config';

import { INPUT_CONFIG } from './ipc-channels';
import { WindowProvider } from './window-provider';
import { PluginRegistry } from './plugin-registry';
import { InputRegistry } from './input-registry';

const { MainWindow } = WindowProvider;

ipcMain.on(
  INPUT_CONFIG.GET_INPUT_CONFIGS,
  (e: IpcMainEvent, deviceId: string, inputIds: string[]) => {
    e.returnValue = inputIds.map((id) =>
      InputRegistry.get(`${deviceId}::${id}`)!.toDTO()
    );
  }
);

ipcMain.on(
  INPUT_CONFIG.REMOVE_PLUGIN,
  (_e: IpcMainEvent, pluginId: string, deviceId: string, inputId: string) => {
    const inputConfig = InputRegistry.get(`${deviceId}::${inputId}`);

    if (inputConfig instanceof MonoInputConfig) {
      inputConfig.plugins = inputConfig.plugins.filter((p) => p !== pluginId);

      PluginRegistry.deregister(pluginId);
      MainWindow.sendReduxEvent({
        type: 'inputConfigs/upsertOne',
        payload: inputConfig.toDTO(),
      });
    }
  }
);

ipcMain.on(
  INPUT_CONFIG.GET_INPUT_CONFIG,
  (e, deviceId: string, inputId: string) => {
    const inputConfig = InputRegistry.get(`${deviceId}-${inputId}`);

    e.returnValue = inputConfig ? inputConfig.toDTO() : undefined;
  }
);

ipcMain.on(
  INPUT_CONFIG.UPDATE_INPUT,
  (_e: IpcMainEvent, deviceId: string, configs: InputDTO[]) => {
    const updatedConfigs: BaseInputConfig[] = [];
    configs.forEach((c) => {
      const input = InputRegistry.get(`${deviceId}-${c.id}`);

      if (input) {
        input.applyStub(c);
        updatedConfigs.push(input);

        MainWindow.sendInputState(deviceId, c.id, input.state);
        MainWindow.sendInputConfig(deviceId, c.id, c);
        MainWindow.sendInputConfigs([input.toDTO()]);
      }
    });

    MainWindow.edited = true;
  }
);
