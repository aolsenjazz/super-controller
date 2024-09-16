import { DeviceStub } from '../device-stub';
import { DeviceConfigDTO } from '../hardware-config/device-config';

export interface PluginUIProps {
  pluginId: string;
  connectedDevices: DeviceStub[];
  selectedDevice: DeviceConfigDTO;
}
