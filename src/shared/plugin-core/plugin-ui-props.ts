import { DeviceConfigDTO } from '../hardware-config/device-config';

export interface PluginUIProps {
  pluginId: string;
  connectedDevices: string[];
  selectedDevice: DeviceConfigDTO;
}
