import { BrowserWindow, Menu } from 'electron';

import { build as buildDarwin } from './darwin-menu';
import { build as buildDefault } from './default-menu';

import { wp } from '../window-provider';

class AppMenuSingleton {
  private static instance: AppMenuSingleton;

  private constructor() {
    wp.onFocusChange(this.buildMenu);
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
