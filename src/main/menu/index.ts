import { BrowserWindow, ipcMain, IpcMainEvent, Menu, MenuItem } from 'electron';

import { allDevicePlugins } from '@plugins/plugin-utils';

import { build as buildDarwin } from './darwin-menu';
import { build as buildDefault } from './default-menu';

import { wp } from '../window-provider';
import { ProjectProvider } from '@main/project-provider';

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
    function createMenu(deviceId: string) {
      return allDevicePlugins().map((Plugin) => {
        return new MenuItem({
          label: Plugin.TITLE(),
          toolTip: Plugin.DESCRIPTION(),
          click: () => {
            const dev = ProjectProvider.project.getDevice(deviceId);
            console.log(deviceId);
            dev.addPlugin(new Plugin());

            wp.MainWindow.sendConfigStub(dev.id, dev.stub);
          },
        });
      });
    }

    ipcMain.on(
      'show-device-plugin-menu',
      (e: IpcMainEvent, x: number, y: number, deviceId: string) => {
        const template = [
          ...createMenu(deviceId),
          // { type: 'separator' },
          // { label: 'Menu Item 2', type: 'checkbox', checked: true },
        ];
        const menu = Menu.buildFromTemplate(template);
        const win = BrowserWindow.fromWebContents(e.sender) || undefined;
        menu.popup({ window: win, x, y });
      }
    );
  }
}

export const AppMenu = AppMenuSingleton.getInstance();
