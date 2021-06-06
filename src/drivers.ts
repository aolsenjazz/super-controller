import { DeviceDriver } from './driver-types';

const path = require('path');
const fs = require('fs');

const fNameRegex = new RegExp(/^.+\.json$/);

/* Returns a list of the names of available drivers. */
export function getAvailableDrivers(): string[] {
  const allFiles: string[] = fs.readdirSync(path.join(__dirname, 'drivers'));
  const filtered = allFiles.filter((fName) => fNameRegex.test(fName));
  return filtered;
}

/* Loads a driver by file name */
function loadDriver(fileName: string): DeviceDriver {
  let fName = fileName;
  if (!fName.endsWith('.json')) fName = `${fName}.json`;

  const filePath = path.join(__dirname, 'drivers', fName);
  return JSON.parse(fs.readFileSync(filePath));
}

function loadAll(): DeviceDriver[] {
  const allNames = getAvailableDrivers();
  return allNames.map((name) => loadDriver(name));
}

export const DRIVERS: Map<string, DeviceDriver> = (() => {
  const deviceMap = new Map();
  const deviceList = loadAll();
  deviceList.forEach((device: DeviceDriver) => {
    deviceMap.set(device.name, device);
  });
  return deviceMap;
})();
