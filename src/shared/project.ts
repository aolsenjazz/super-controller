import { DeviceConfig } from './hardware-config';

export class Project {
  static CURRENT_VERSION = 6;

  version?: number;

  /* Configured devices. See `SupportedDeviceConfig` for more. */
  devices: DeviceConfig[];

  constructor(devices?: DeviceConfig[], version?: number) {
    this.devices = devices || [];
    this.version = version || Project.CURRENT_VERSION;
  }

  /**
   * Adds a device configuration to this project.
   *
   * @param config The config to add
   */
  addDevice(config: DeviceConfig) {
    this.devices.push(config);
  }

  /**
   * Removes a device configuration to this project.
   *
   * @param config The config to remove
   */
  removeDevice(config: DeviceConfig) {
    let idx = -1;
    this.devices.forEach((d, index) => {
      if (d.id === config.id) {
        idx = index;
      }
    });

    if (idx !== -1) {
      this.devices.splice(idx, 1);
    }
  }

  /**
   * Returns the device config for given id.
   *
   * @param id The requested device id
   * @returns device config
   */
  getDevice(id: string | undefined) {
    return this.devices.filter((d) => d.id === id)[0];
  }
}
