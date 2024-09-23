import { ipcRenderer } from 'electron';

import { MENU } from '../ipc-channels';

export const MenuService = {
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
