import { DeviceConfigDTO } from '../types';
import { PluginDTO } from './base-plugin';

export interface PluginUIProps<T extends PluginDTO = PluginDTO> {
  plugin: Readonly<T>;
  connectedDevices: Readonly<string[]>;
  selectedDevice: Readonly<DeviceConfigDTO>;
  applyChanges: (dto: T) => void;
}
