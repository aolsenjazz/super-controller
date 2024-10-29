import { PortInfo } from './port-info';
import { DeviceDriver } from './driver-types';

export class DrivenPortInfo extends PortInfo {
  driver: DeviceDriver;

  constructor(
    name: string,
    siblingIndex: number,
    connected: boolean,
    deviceDriver: DeviceDriver,
  ) {
    super(name, siblingIndex, connected);

    this.driver = deviceDriver;
  }
}
