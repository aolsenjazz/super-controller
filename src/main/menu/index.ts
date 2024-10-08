import { BrowserWindow, Menu } from 'electron';

import { build as buildDarwin } from './darwin-menu';
import { build as buildDefault } from './default-menu';

import { WindowProvider } from '../window-provider';

/**
 * Provides functions for creating an app menu, and binds a listener to Window focus
 * changes so that a different AppMenu can be displayed depending on which (or if a)
 * menu is currently in focus
 */
class AppMenuSingleton {
  private static instance: AppMenuSingleton;

  private constructor() {
    WindowProvider.onFocusChange(this.buildMenu);
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
}

export const AppMenu = AppMenuSingleton.getInstance();
