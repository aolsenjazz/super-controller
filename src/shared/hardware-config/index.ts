import { DeviceDriver } from '@shared/driver-types/device-driver';

import { SupportedDeviceConfig } from './supported-device-config';
import { AnonymousDeviceConfig } from './anonymous-device-config';
import { AdapterDeviceConfig } from './adapter-device-config';
import { DeviceConfig } from './device-config';

export function configFromDriver(
  portName: string,
  siblingIndex: number,
  driver: DeviceDriver
) {
  let config: DeviceConfig;

  if (driver.anonymous) {
    config = new AnonymousDeviceConfig(portName, siblingIndex);
  } else if (driver.type === 'adapter') {
    config = new AdapterDeviceConfig(portName, driver.name, siblingIndex);
  } else {
    config = new SupportedDeviceConfig(portName, driver.name, siblingIndex);
  }

  return config;
}
