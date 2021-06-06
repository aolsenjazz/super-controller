import { DeviceConfig } from './device-config';

export class UnsupportedDeviceConfig implements DeviceConfig {
  readonly supported = false;

  readonly id: string;

  readonly name: string;

  readonly occurrenceNumber: number;

  constructor(id: string, name: string, occurrenceNumber: number) {
    this.id = id;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;
  }
}
