import { MENU } from '@main/ipc-channels';
import { ipcRenderer } from 'electron';

export const menuService = {
  showDevicePluginMenu(x: number, y: number, deviceId: string) {
    ipcRenderer.send(MENU.DEVICE_PLUGIN_MENU, x, y, deviceId);
  },

  showInputPluginMenu(
    x: number,
    y: number,
    deviceId: string,
    inputIds: string[]
  ) {
    ipcRenderer.send(MENU.INPUT_PLUGIN_MENU, x, y, deviceId, inputIds);
  },
};

export type MenuService = typeof menuService;
