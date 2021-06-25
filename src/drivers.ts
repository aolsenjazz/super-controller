/**
 * Contains a number of methods for accessing driver from their JSON files.
 * *SHOULD NOT BE CALLED FROM FRONTEND* as paths will vary.
 */

import { DeviceDriver } from './driver-types';

const path = require('path');
const fs = require('fs');

const fNameRegex = new RegExp(/^.+\.json$/);

/**
 * Returns a list of the names of available drivers.
 *
 * @return { string[] } List of names of driver files e.g. 'APC Key 25.json'
 */
export function getAvailableDrivers(): string[] {
  const allFiles: string[] = fs.readdirSync(path.join(__dirname, 'drivers'));
  const filtered = allFiles.filter((fName) => fNameRegex.test(fName));
  return filtered;
}

/**
 * Loads a driver by file name
 *
 * @param { string } fileName The file name
 * @return { DeviceDriver } The driver
 */
function loadDriver(fileName: string): DeviceDriver {
  let fName = fileName;
  if (!fName.endsWith('.json')) fName = `${fName}.json`;

  const filePath = path.join(__dirname, 'drivers', fName);
  return JSON.parse(fs.readFileSync(filePath));
}

/**
 * Loads all available drivers. *CANNOT BE CALLED FROM FRONTED*
 *
 * @return { DeviceDriver[] } All drivers
 */
function loadAll(): DeviceDriver[] {
  const allNames = getAvailableDrivers();
  return allNames.map((name) => loadDriver(name));
}

/* No need to load all of the drivers multiple times; load them once here and make accessible: */
export const DRIVERS: Map<string, DeviceDriver> = (() => {
  const deviceMap = new Map();
  const deviceList = loadAll();
  deviceList.forEach((device: DeviceDriver) => {
    deviceMap.set(device.name, device);
  });
  return deviceMap;
})();
