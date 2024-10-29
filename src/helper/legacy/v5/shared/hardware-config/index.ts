import { SupportedDeviceConfig } from './supported-device-config';
import { AnonymousDeviceConfig } from './anonymous-device-config';
import { AdapterDeviceConfig } from './adapter-device-config';
import { DeviceConfig } from './device-config';
import { DeviceDriver } from '../driver-types';

export {
  MonoInputConfig,
  LightCapableInputConfig,
  BaseInputConfig,
  SwitchConfig,
} from './input-config';
export { AdapterDeviceConfig };
export { DeviceConfig };
export { AnonymousDeviceConfig };
export { SupportedDeviceConfig };

export function configFromDriver(
  portName: string,
  siblingIndex: number,
  driver: DeviceDriver,
) {
  if (driver.anonymous) {
    return new AnonymousDeviceConfig(portName, siblingIndex, new Map(), []);
  }

  if (driver.type === 'adapter') {
    return new AdapterDeviceConfig(portName, driver.name, siblingIndex);
  }

  return SupportedDeviceConfig.fromDriver(portName, siblingIndex, driver);
}
