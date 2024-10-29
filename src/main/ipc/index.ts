import os from 'os';
import { ipcMain, shell, IpcMainEvent } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';

import { HOST, LAYOUT } from './ipc-channels';
import { LayoutParams, Store } from '../store';

// Load feature-specific ipc files
import './initialize-plugin-ipc';
import './initialize-device-config-ipc';
import './initialize-input-config-ipc';

// When the frontend as for OS details, send them
ipcMain.on(HOST.OS, (e: IpcMainEvent) => {
  e.returnValue = os.platform();
});

// User wants to send an email
ipcMain.on(HOST.REQUEST, (_e: IpcMainEvent, deviceName: string) => {
  const template = deviceName
    ? controllerRequest(deviceName)
    : fivePinRequest();
  shell.openExternal(
    `mailto:${template.to}?subject=${template.subject}&body=${template.body}`,
  );
});

ipcMain.on(LAYOUT.GET_LAYOUT, (e: IpcMainEvent) => {
  e.returnValue = Store.getLayoutParams();
});

ipcMain.on(LAYOUT.SET_LAYOUT, (e: IpcMainEvent, lp: LayoutParams) => {
  e.returnValue = Store.setLayoutParams(lp);
});

ipcMain.on(LAYOUT.GET_LAYOUT_ITEM, (e: IpcMainEvent, s: string) => {
  e.returnValue = Store.getLayoutItem(s);
});

ipcMain.on(LAYOUT.SET_LAYOUT_ITEM, (e: IpcMainEvent, s: string, v: string) => {
  e.returnValue = Store.setLayoutItem(s, v);
});
