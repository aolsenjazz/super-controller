import { ipcRenderer } from 'electron';

import { LayoutParams } from '../store';
import { LAYOUT } from '../ipc/ipc-channels';

/**
 * Expose functions to store layout parameters in between session
 */
export const LayoutService = {
  getLayoutParams(): LayoutParams {
    return ipcRenderer.sendSync(LAYOUT.GET_LAYOUT);
  },

  setLayoutParams(lp: LayoutParams): void {
    return ipcRenderer.sendSync(LAYOUT.SET_LAYOUT, lp);
  },

  getItem(s: string): string | null {
    return ipcRenderer.sendSync(LAYOUT.GET_LAYOUT_ITEM, s);
  },

  setItem(s: string, v: string): void {
    return ipcRenderer.sendSync(LAYOUT.SET_LAYOUT_ITEM, s, v);
  },
};
