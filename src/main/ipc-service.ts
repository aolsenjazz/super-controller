/**
 * Just sets some listeners for misc IPC events.
 *
 * TODO: This really should have a better-designed home at some point. Unclear where right now
 */

import os from 'os';
import { ipcMain, Event, shell } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';

import { HOST, LAYOUT } from './ipc-channels';
import { LayoutParams, Store } from './store';

// When the frontend as for OS details, send them
ipcMain.on(HOST.OS, (e: Event) => {
  e.returnValue = os.platform();
});

// User wants to send an email
ipcMain.on(HOST.REQUEST, (_e: Event, deviceName: string) => {
  const template = deviceName
    ? controllerRequest(deviceName)
    : fivePinRequest();
  shell.openExternal(
    `mailto:${template.to}?subject=${template.subject}&body=${template.body}`
  );
});

ipcMain.on(LAYOUT.GET_LAYOUT, (e: Event) => {
  e.returnValue = Store.getLayoutParams();
});

ipcMain.on(LAYOUT.SET_LAYOUT, (e: Event, lp: LayoutParams) => {
  e.returnValue = Store.setLayoutParams(lp);
});

ipcMain.on(LAYOUT.GET_LAYOUT_ITEM, (e: Event, s: string) => {
  e.returnValue = Store.getLayoutItem(s);
});

ipcMain.on(LAYOUT.SET_LAYOUT_ITEM, (e: Event, s: string, v: string) => {
  e.returnValue = Store.setLayoutItem(s, v);
});
