import { BrowserWindow, ipcMain, IpcMainEvent, Menu, MenuItem } from 'electron';

import { build as buildDarwin } from './darwin-menu';
import { build as buildDefault } from './default-menu';

import { wp } from '../window-provider';

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
      'show-device-plugin-menu',
      (e: IpcMainEvent, x: number, y: number) => {
        const template = [
          new MenuItem({
            label: 'Menu Item 1',
            click: () => {
              e.sender.send('context-menu-command', 'menu-item-1');
            },
          }),
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
