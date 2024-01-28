import { ipcRenderer } from 'electron';

export const menuService = {
  showDevicePluginMenu(x: number, y: number, deviceId: string) {
    ipcRenderer.send('show-device-plugin-menu', x, y, deviceId);
  },
};

export type MenuService = typeof menuService;
