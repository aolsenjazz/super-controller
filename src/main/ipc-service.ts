/**
 * Just sets some listeners for misc IPC events.
 *
 * TODO: This really should have a better-designed home at some point. Unclear where right now
 */

import os from 'os';
import { ipcMain, Event, shell } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';
import { DRIVERS } from '@shared/drivers';

import { DRIVERS as DRIVERS_CHANNEL, OS, REQUEST } from './ipc-channels';

// When the frontend requests the drivers, send them
ipcMain.on(DRIVERS_CHANNEL, (e: Event) => {
  e.returnValue = Array.from(DRIVERS.entries());
});

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
