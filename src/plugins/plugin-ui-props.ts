import { DeviceStub } from '@shared/device-stub';
import { DeviceIcicle } from '@shared/hardware-config/device-config';
import type { PluginIcicle } from './base-plugin';

export interface PluginUIProps {
  plugins: PluginIcicle[];
  connectedDevices: DeviceStub[];
  selectedDevice: DeviceIcicle;
}
