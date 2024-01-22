import { ipcRenderer } from 'electron';

export const menuService = {
  showDevicePluginMenu(x: number, y: number) {
    ipcRenderer.send('show-device-plugin-menu', x, y);
  },
};

export type MenuService = typeof menuService;
