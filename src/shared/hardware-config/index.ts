import { DeviceDriver } from '../driver-types/device-driver';

import {
  SupportedDeviceConfig,
  SupportedDeviceConfigDTO,
} from './supported-device-config';
import { AnonymousDeviceConfig } from './anonymous-device-config';
import { AdapterDeviceConfig } from './adapter-device-config';
import { DeviceConfig, DeviceConfigDTO } from './device-config';

export function deviceConfigFromDTO(other: DeviceConfigDTO) {
  let config: DeviceConfig;

  if (other.type === 'supported') {
    config = new SupportedDeviceConfig(
      other.portName,
      other.driverName,
      other.siblingIndex,
      other.nickname,
      other.plugins,
    );

    (config as SupportedDeviceConfig).inputs = (
      other as SupportedDeviceConfigDTO
    ).inputs;
  } else if (other.type === 'adapter') {
    config = new AdapterDeviceConfig(
      other.portName,
      other.driverName,
      other.siblingIndex,
      other.child
        ? (deviceConfigFromDTO(other.child) as SupportedDeviceConfig)
        : undefined,
    );
  } else if (other.type === 'anonymous') {
    config = new AnonymousDeviceConfig(
      other.portName,
      other.siblingIndex,
      other.nickname,
      other.plugins,
    );
  } else {
    throw new Error(`invalid device config DTO class name: ${other.className}`);
  }

  return config;
}

export function configFromDriver(
  portName: string,
  siblingIndex: number,
  driver: DeviceDriver,
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
