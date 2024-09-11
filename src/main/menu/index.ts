import { BrowserWindow, ipcMain, IpcMainEvent, Menu } from 'electron';

import { MENU } from '@main/ipc-channels';

import { build as buildDarwin } from './darwin-menu';
import { build as buildDefault } from './default-menu';

import { wp } from '../window-provider';
import { createDevicePluginMenu } from './device-plugin-menu';
import { createInputPluginMenu } from './input-plugin-menu';

/**
 * Provides functions for creating an app menu, and binds a listener to Window focus
 * changes so that a different AppMenu can be displayed depending on which (or if a)
 * menu is currently in focus
 */
class AppMenuSingleton {
  private static instance: AppMenuSingleton;

  private constructor() {
    wp.onFocusChange(this.buildMenu);
    this.initIpcListeners();
  }

  public static getInstance(): AppMenuSingleton {
    if (!AppMenuSingleton.instance) {
      AppMenuSingleton.instance = new AppMenuSingleton();
    }
    return AppMenuSingleton.instance;
  }

  public buildMenu(w: BrowserWindow | null) {
    const template =
      process.platform === 'darwin' ? buildDarwin(w) : buildDefault(w);
    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);
  }

  private initIpcListeners() {
    ipcMain.on(
      MENU.DEVICE_PLUGIN_MENU,
      async (e: IpcMainEvent, x: number, y: number, deviceId: string) => {
        const template = await createDevicePluginMenu(deviceId);
        const menu = Menu.buildFromTemplate(template);
        const win = BrowserWindow.fromWebContents(e.sender) || undefined;
        menu.popup({ window: win, x, y });
      }
    );

    ipcMain.on(
      MENU.INPUT_PLUGIN_MENU,
      async (
        e: IpcMainEvent,
        x: number,
        y: number,
        deviceId: string,
        inputIds: string[]
      ) => {
        const template = await createInputPluginMenu(deviceId, inputIds);
        const menu = Menu.buildFromTemplate(template);
        const win = BrowserWindow.fromWebContents(e.sender) || undefined;
        menu.popup({ window: win, x, y });
      }
    );
  }
}

export const AppMenu = AppMenuSingleton.getInstance();
