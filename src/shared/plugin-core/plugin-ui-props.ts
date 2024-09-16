import { DeviceStub } from '../device-stub';
import { DeviceIcicle } from '../hardware-config/device-config';
import type { PluginDTO } from './base-plugin';

export interface PluginUIProps<T extends PluginDTO = PluginDTO> {
  plugins: T[];
  connectedDevices: DeviceStub[];
  selectedDevice: DeviceIcicle;
}
