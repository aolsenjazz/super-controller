import { DeviceStub } from '../device-stub';
import { DeviceIcicle } from '../hardware-config/device-config';
import type { PluginIcicle } from './base-plugin';

export interface PluginUIProps<T extends PluginIcicle = PluginIcicle> {
  plugins: T[];
  connectedDevices: DeviceStub[];
  selectedDevice: DeviceIcicle;
}
