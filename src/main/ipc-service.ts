/**
 * Just sets some listeners for misc IPC events.
 *
 * TODO: This really should have a better-designed home at some point. Unclear where right now
 */

import os from 'os';
import { ipcMain, Event, shell, IpcMainEvent } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';
import { SupportedDeviceConfig } from '@shared/hardware-config';

import { ProjectProvider as pp, ProjectProvider } from './project-provider';
import { wp } from './window-provider';
import { HOST, CONFIG, LAYOUT } from './ipc-channels';
import { LayoutParams, Store } from './store';

const { MainWindow } = wp;

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
  const p = pp.project;
  const conf = p.getDevice(id);
  const desc = conf ? conf.toDTO() : undefined;

  MainWindow.sendConfigStub(id, desc);
});

ipcMain.on(
  HOST.REQUEST_INPUT_STATE,
  (_e: Event, deviceId: string, inputString: string) => {
    const p = pp.project;
    const d = p.getDevice(deviceId);

    if (d && d instanceof SupportedDeviceConfig) {
      const state = d.getInputById(inputString)?.state;

      if (state) MainWindow.sendInputState(deviceId, inputString, state);
    }
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
  e.returnValue = ProjectProvider.project.getDevice(deviceId)?.toDTO();
});
