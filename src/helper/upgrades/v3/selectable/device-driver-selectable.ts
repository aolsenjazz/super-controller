import { Selectable } from './selectable';
import { DeviceDriver } from '../driver-types';

export class DeviceDriverSelectable implements Selectable<DeviceDriver> {
  driver: DeviceDriver;

  constructor(fx: DeviceDriver) {
    this.driver = fx;
  }

  label() {
    return this.driver.name;
  }

  equals(other: DeviceDriver | string) {
    return typeof other === 'string'
      ? other === this.driver.name
      : this.driver.name === other.name;
  }

  get() {
    return this.driver;
  }
}
