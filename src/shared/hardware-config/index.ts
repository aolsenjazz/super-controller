import { DeviceDriver } from '@shared/driver-types/device-driver';
import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';

import { SupportedDeviceConfig } from './supported-device-config';
import { AnonymousDeviceConfig } from './anonymous-device-config';
import { AdapterDeviceConfig } from './adapter-device-config';
import { create } from './input-config';
import { DeviceConfig } from './device-config';

export function configFromDriver(
  portName: string,
  siblingIndex: number,
  driver: DeviceDriver,
  parentId?: string
) {
  let config: DeviceConfig;

  if (driver.anonymous) {
    config = new AnonymousDeviceConfig(portName, siblingIndex);
  } else if (driver.type === 'adapter') {
    config = new AdapterDeviceConfig(portName, driver.name, siblingIndex);
  } else {
    config = new SupportedDeviceConfig(portName, driver.name, siblingIndex);

    driver.inputGrids
      .flatMap((g) => g.inputs)
      .filter((i) => i.interactive)
      .map((i) => i as InteractiveInputDriver)
      .forEach((d) => {
        const inputs = create(parentId || config.id, d);

        (config as SupportedDeviceConfig).inputs.push(
          ...inputs.map((i) => i.id)
        );
      });
  }

  return config;
}
