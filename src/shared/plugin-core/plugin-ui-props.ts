import { DeviceConfigDTO } from '../hardware-config/device-config';
import { PluginDTO } from './base-plugin';

export interface PluginUIProps<T extends PluginDTO = PluginDTO> {
  plugin: Readonly<T>;
  connectedDevices: string[];
  selectedDevice: DeviceConfigDTO;
  applyChanges: (dto: T) => void;
}
