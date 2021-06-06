declare module 'electron-main-window' {
  import { BrowserWindow } from 'electron';

  export function getMainWindow(): BrowserWindow | null;
}
