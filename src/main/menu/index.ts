import { BrowserWindow, Menu } from 'electron';

import { build as buildDarwin } from './darwin-menu';
import { build as buildDefault } from './default-menu';

import { wp } from '../window-provider';

class MenuProviderSingleton {
  private static instance: MenuProviderSingleton;

  private constructor() {
    wp.onFocusChange(this.buildMenu);
  }

  public static getInstance(): MenuProviderSingleton {
    if (!MenuProviderSingleton.instance) {
      MenuProviderSingleton.instance = new MenuProviderSingleton();
    }
    return MenuProviderSingleton.instance;
  }

  public buildMenu(w: BrowserWindow | null) {
    const template =
      process.platform === 'darwin' ? buildDarwin(w) : buildDefault(w);
    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);
  }
}

export const MenuProvider = MenuProviderSingleton.getInstance();
