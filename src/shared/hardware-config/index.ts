import { DeviceDriver } from '@shared/driver-types/device-driver';
import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';
import { InputRegistry } from '@main/input-registry';

import { SupportedDeviceConfig } from './supported-device-config';
import { AnonymousDeviceConfig } from './anonymous-device-config';
import { AdapterDeviceConfig } from './adapter-device-config';
import { create } from './input-config';

export function configFromDriver(
  portName: string,
  siblingIndex: number,
  driver: DeviceDriver
) {
  if (driver.anonymous) {
    return new AnonymousDeviceConfig(portName, siblingIndex);
  }

  if (driver.type === 'adapter') {
    return new AdapterDeviceConfig(portName, driver.name, siblingIndex);
  }

  const supported = new SupportedDeviceConfig(
    portName,
    driver.name,
    siblingIndex
  );

  driver.inputGrids
    .flatMap((g) => g.inputs)
    .filter((i) => i.interactive)
    .map((i) => i as InteractiveInputDriver)
    .forEach((d) => {
      const input = create(supported.id, d);
      supported.inputs.push(input.id);
      InputRegistry.register(input.qualifiedId, input);
    });

  return supported;
}
