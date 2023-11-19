/**
 * Just sets some listeners for misc IPC events.
 *
 * TODO: This really should have a better-designed home at some point. Unclear where right now
 */

import os from 'os';
import { ipcMain, Event, shell } from 'electron';

import { controllerRequest, fivePinRequest } from '@shared/email-templates';
import { DRIVERS } from '@shared/drivers';
import { SupportedDeviceConfig } from '@shared/hardware-config';

import { ProjectProvider as pp } from './project-provider';
import { PortService as ps } from './port-service';
import { wp } from './window-provider';
import {
  DRIVERS as DRIVERS_CHANNEL,
  OS,
  REQUEST,
  REQUEST_DEVICE_DESCRIPTOR,
  REQUEST_DEVICE_LIST,
  REQUEST_INPUT_DESCRIPTOR,
} from './ipc-channels';
import { PadConfig } from '@shared/hardware-config/input-config';

const { MainWindow } = wp;

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

// request a list of all device IDs
ipcMain.on(REQUEST_DEVICE_LIST, () => {
  // TODO: this code is duplicated in PortService; not worth consolidating now
  const configuredDeviceIds = pp.project.devices.map((d) => d.id);
  const availableDevices = Array.from(ps.portPairs.keys());
  const deviceIds = Array.from(
    new Set([...configuredDeviceIds, ...availableDevices])
  );

  MainWindow.sendDeviceList(deviceIds);
});

ipcMain.on(REQUEST_DEVICE_DESCRIPTOR, (_e: Event, id: string) => {
  const p = pp.project;
  const conf = p.getDevice(id);
  const port = ps.portPairs.get(id);

  const descriptor = {
    id,
    siblingIdx: port?.siblingIndex || 0,
    name: conf?.nickname || port?.name || '',
    nickname: conf?.nickname || '',
    driverName: conf?.driverName || port?.name || '',
    configured: conf !== undefined,
    connected: ps.portPairs.get(id) !== undefined,
  };

  MainWindow.sendDeviceDescriptor(descriptor);
});

ipcMain.on(
  REQUEST_INPUT_DESCRIPTOR,
  (_e: Event, deviceId: string, inputId: string) => {
    const p = pp.project;
    const d = p.getDevice(deviceId);

    if (d && d instanceof SupportedDeviceConfig) {
      const conf = d.getInput(inputId);

      if (conf) {
        if (conf instanceof PadConfig && conf.defaults.number === 32) {
          console.log(conf.devicePropagator);
        }
        MainWindow.sendInputDescriptor(deviceId, inputId, conf.descriptor);
      }
    }
  }
);
