/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';

import { Project } from '@shared/project';
import { SupportedDeviceConfig } from '@shared/hardware-config';
import { DRIVERS } from '@shared/drivers';

const APC_DRIVER = DRIVERS.get('APC Key 25');

test('addDevice() adds to project.devices', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  proj.addDevice(device);
  expect(device).toEqual(proj.devices[0]);
});

test('removeDevice() remove from project.devices', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  proj.addDevice(device);
  proj.removeDevice(device);
  expect(proj.devices.length).toBe(0);
});

test('removeDevice() with nonexistent device doesnt do anything', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  const device2 = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    1,
    APC_DRIVER!
  );
  proj.addDevice(device);
  proj.removeDevice(device2);
  expect(proj.devices.length).toBe(1);
});

test('get() returns correct device', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  proj.addDevice(device);
  const result = proj.getDevice(device.id);
  expect(result).toEqual(device);
});

test('get() with nonexistent ID returns undefined', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  proj.addDevice(device);
  const result = proj.getDevice('badId');
  expect(result).toBe(undefined);
});

test('get() with undefined ID returns undefined', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  proj.addDevice(device);
  const result = proj.getDevice(undefined);
  expect(result).toBe(undefined);
});

test('toJSON() returns valid JSON', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver(
    APC_DRIVER!.name,
    0,
    APC_DRIVER!
  );
  proj.addDevice(device);

  const json = JSON.stringify(proj);
  expect(() => JSON.parse(json)).not.toThrow();
});
