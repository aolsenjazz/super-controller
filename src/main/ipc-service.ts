/**
 * Just sets some listeners for misc IPC events.
 *
 * TODO: This really should have a better-designed home at some point. Unclear where right now
 */

import os from 'os';
import { ipcMain, Event, shell } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';
import { SupportedDeviceConfig } from '@shared/hardware-config';

import { ProjectProvider as pp } from './project-provider';
import { wp } from './window-provider';
import {
  OS,
  REQUEST,
  REQUEST_CONFIG_STUB,
  REQUEST_INPUT_STATE,
} from './ipc-channels';

const { MainWindow } = wp;

// When the frontend as for OS details, send them
ipcMain.on(OS, (e: Event) => {
  e.returnValue = os.platform();
});

ipcMain.on(REQUEST, (_e: Event, deviceName: string) => {
  const template = deviceName
    ? controllerRequest(deviceName)
    : fivePinRequest();
  shell.openExternal(
    `mailto:${template.to}?subject=${template.subject}&body=${template.body}`
  );
});

ipcMain.on(REQUEST_CONFIG_STUB, (_e: Event, id: string) => {
  const p = pp.project;
  const conf = p.getDevice(id);
  const desc = conf ? conf.stub : undefined;

  MainWindow.sendConfigStub(id, desc);
});

ipcMain.on(
  REQUEST_INPUT_STATE,
  (_e: Event, deviceId: string, inputId: string) => {
    const p = pp.project;
    const d = p.getDevice(deviceId);

    if (d && d instanceof SupportedDeviceConfig) {
      const state = d.getInput(inputId)?.state;

      if (state) MainWindow.sendInputState(deviceId, inputId, state);
    }
  }
);
