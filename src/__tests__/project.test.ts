/* eslint @typescript-eslint/no-non-null-assertion: 0 */

import { test, expect } from '@jest/globals';

import { Project } from '@shared/project';
import { SupportedDeviceConfig } from '@shared/hardware-config';

import { DRIVERS } from '../main/drivers';

const APC_DRIVER = DRIVERS.get('APC Key 25');

test('addDevice() adds to project.devices', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  proj.addDevice(device);
  expect(JSON.stringify(device)).toBe(JSON.stringify(proj.devices[0]));
});

test('removeDevice() remove from project.devices', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  proj.addDevice(device);
  proj.removeDevice(device);
  expect(proj.devices.length).toBe(0);
});

test('removeDevice() with nonexistent device doesnt do anything', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  const device2 = SupportedDeviceConfig.fromDriver('APC2', 1, APC_DRIVER!);
  proj.addDevice(device);
  proj.removeDevice(device2);
  expect(proj.devices.length).toBe(1);
});

test('get() returns correct device', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  proj.addDevice(device);
  const result = proj.getDevice(device.id);
  expect(JSON.stringify(result)).toBe(JSON.stringify(device));
});

test('get() with nonexistent ID returns null', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  proj.addDevice(device);
  const result = proj.getDevice('badId');
  expect(result).toBe(null);
});

test('toJSON() returns valid JSON', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  proj.addDevice(device);

  const json = proj.toJSON(true);
  expect(() => JSON.parse(json)).not.toThrow();
});

test('to and from JSON correct transfers device config', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  proj.addDevice(device);

  const json = proj.toJSON(true);
  const result = Project.fromJSON(json);

  expect(result.devices[0].id).toBe('APC');
});

test('to and from JSON correctly transfers input configs', () => {
  const proj = new Project();
  const device = SupportedDeviceConfig.fromDriver('APC', 0, APC_DRIVER!);
  const input = device.inputs[0];
  input.number = 7;
  proj.addDevice(device);

  const json = proj.toJSON(true);
  const result = Project.fromJSON(json);

  const d = result.devices[0] as SupportedDeviceConfig;
  expect(d.inputs[0].number).toBe(input.number);
});
