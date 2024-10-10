import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';

import { MonoInputConfig } from '@shared/hardware-config';
import {
  BaseInputConfig,
  InputDTO,
} from '@shared/hardware-config/input-config/base-input-config';
import { getQualifiedInputId } from '@shared/util';
import { PluginManifest } from '@shared/plugin-core/plugin-manifest';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { importInputSubcomponent } from '@plugins/plugin-loader';

import { INPUT_CONFIG } from './ipc-channels';
import { WindowProvider } from '../window-provider';
import { PluginRegistry } from '../plugin-registry';
import { InputRegistry } from '../input-registry';
import { createInputPluginMenu } from '../menu/input-plugin-menu';

const { MainWindow } = WindowProvider;

ipcMain.on(
  INPUT_CONFIG.INPUT_PLUGIN_MENU,
  async (e: IpcMainEvent, x: number, y: number, qualifiedInputId: string) => {
    // create onclick listener
    const onClick = async (m: PluginManifest) => {
      const input = InputRegistry.get(qualifiedInputId);

      if (!(input instanceof MonoInputConfig))
        throw new Error(`Adding plugin to ${input} is not defined`);

      const inputDriver = input.driver;
      const Plugin = await importInputSubcomponent(m.title, 'plugin');
      const plugin: BaseInputPlugin = new Plugin(qualifiedInputId, inputDriver);
      input.plugins.push(plugin.id);

      PluginRegistry.register(plugin.id, plugin);

      MainWindow.sendReduxEvent({
        type: 'plugins/upsertOne',
        payload: plugin.toDTO(),
      });

      MainWindow.sendReduxEvent({
        type: 'inputConfigs/upsertOne',
        payload: input.toDTO(),
      });
    };

    // show the add-plugin-menu
    const template = await createInputPluginMenu(onClick);
    const menu = Menu.buildFromTemplate(template);
    const win = BrowserWindow.fromWebContents(e.sender) || undefined;
    menu.popup({ window: win, x, y });
  }
);

ipcMain.on(
  INPUT_CONFIG.REMOVE_PLUGIN,
  (_e: IpcMainEvent, pluginId: string, qualifiedInputId: string) => {
    const inputConfig = InputRegistry.get(qualifiedInputId);

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
  INPUT_CONFIG.UPDATE_INPUT,
  (_e: IpcMainEvent, configs: InputDTO[]) => {
    const updatedConfigs: BaseInputConfig[] = [];
    configs.forEach((c) => {
      const input = InputRegistry.get(getQualifiedInputId(c.deviceId, c.id));

      if (input) {
        input.applyStub(c);
        updatedConfigs.push(input);

        MainWindow.sendReduxEvent({
          type: 'inputConfigs/upsertOne',
          payload: input.toDTO(),
        });
      }
    });

    MainWindow.edited = true;
  }
);
