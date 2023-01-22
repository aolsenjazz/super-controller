import { SupportedDeviceConfig } from './supported-device-config';

export class AdapterDeviceConfig extends SupportedDeviceConfig {
  isAdapter = true;

  child?: SupportedDeviceConfig;

  constructor(name: string, siblingIndex: number) {
    super(name, siblingIndex, [], []);
  }

  setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  get isSet() {
    return this.child !== undefined;
  }
}
