import { SupportedDeviceConfig } from './supported-device-config';
import { AnonymousDeviceConfig } from './anonymous-device-config';
import { DeviceDriver } from '../driver-types';

export { InputConfig } from './input-config';
export { DeviceConfig } from './device-config';
export { AnonymousDeviceConfig };
export { SupportedDeviceConfig };

export function configFromDriver(siblingIndex: number, driver: DeviceDriver) {
  if (driver.anonymous) {
    return new AnonymousDeviceConfig(driver.name, siblingIndex, new Map(), []);
  }

  return SupportedDeviceConfig.fromDriver(siblingIndex, driver);
}
