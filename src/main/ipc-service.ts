/**
 * Just sets some listeners for misc IPC events.
 *
 * TODO: This really should have a better-designed home at some point. Unclear where right now
 */

import os from 'os';
import { ipcMain, Event, shell, IpcMainEvent } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';

import { WindowProvider } from './window-provider';
import { HOST, CONFIG, LAYOUT } from './ipc-channels';
import { LayoutParams, Store } from './store';
import { DeviceRegistry } from './device-registry';
import { InputRegistry } from './input-registry';

const { MainWindow } = WindowProvider;

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

ipcMain.on(CONFIG.REQUEST_DEVICE_CONFIG_STUB, (_e: Event, id: string) => {
  const deviceConfig = DeviceRegistry.get(id);
  const desc = deviceConfig ? deviceConfig.toDTO() : undefined;

  MainWindow.sendConfigStub(id, desc);
});

ipcMain.on(
  HOST.REQUEST_INPUT_STATE,
  (_e: Event, deviceId: string, inputId: string) => {
    const state = InputRegistry.get(`${deviceId}-${inputId}`);

    if (state) MainWindow.sendInputState(deviceId, inputId, state);
  }
);

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

ipcMain.on(CONFIG.GET_DEVICE_CONFIG, (e: IpcMainEvent, deviceId: string) => {
  e.returnValue = DeviceRegistry.get(deviceId)?.toDTO();
});
