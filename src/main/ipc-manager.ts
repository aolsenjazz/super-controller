import os from 'os';
import { ipcMain, Event, shell } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';
import { DRIVERS } from '@shared/drivers';

import { PORTS, DRIVERS as DRIVERS_CHANNEL, OS, REQUEST } from './ipc-channels';
import { PortService as ps } from './port-service';

// When the frontend requests an updated port list, send it
// TODO: this will one day go in the port-service class
ipcMain.on(PORTS, () => {
  ps.sendToFrontend();
});

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
