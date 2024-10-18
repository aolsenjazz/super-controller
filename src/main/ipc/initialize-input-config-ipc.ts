import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';

import {
  BaseInputConfig,
  InputDTO,
} from '@shared/hardware-config/input-config/base-input-config';
import { getQualifiedInputId } from '@shared/util';
import { InputPluginManifest } from '@shared/plugin-core/input-plugin-manifest';
import { ConfigManager } from '@main/config-manager';

import { INPUT_CONFIG } from './ipc-channels';
import { WindowProvider } from '../window-provider';
import { InputRegistry } from '../input-registry';
import { createInputPluginMenu } from '../menu/input-plugin-menu';

const { MainWindow } = WindowProvider;

ipcMain.on(
  INPUT_CONFIG.INPUT_PLUGIN_MENU,
  async (e: IpcMainEvent, x: number, y: number, qualifiedInputId: string) => {
    const input = InputRegistry.get(qualifiedInputId)!;

    // create onclick listener
    const onClick = async (m: InputPluginManifest) => {
      ConfigManager.addInputPlugin(qualifiedInputId, m);
    };

    // show the add-plugin-menu
    const template = await createInputPluginMenu(input, onClick);
    const menu = Menu.buildFromTemplate(template);
    const win = BrowserWindow.fromWebContents(e.sender) || undefined;
    menu.popup({ window: win, x, y });
  }
);

ipcMain.on(
  INPUT_CONFIG.REMOVE_PLUGIN,
  (_e: IpcMainEvent, pluginId: string, qualifiedInputId: string) => {
    ConfigManager.removeInputPlugin(qualifiedInputId, pluginId);
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

        MainWindow.upsertInputConfig(input.toDTO());
      }
    });

    MainWindow.edited = true;
  }
);

ipcMain.on(INPUT_CONFIG.GET_INPUT_CONFIGS, (e: IpcMainEvent) => {
  const configs = InputRegistry.getAll().map((i) => i.toDTO());
  e.returnValue = configs || [];
});
