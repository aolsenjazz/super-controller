import type { DeviceConfigDTO } from '../types';
import type { PluginDTO } from './base-plugin';

export interface PluginUIProps<T extends PluginDTO = PluginDTO> {
  plugin: Readonly<T>;
  connectedDevices: Readonly<string[]>;
  configuredDevices: Readonly<string[]>;
  selectedDevice: Readonly<DeviceConfigDTO>;
  applyChanges: (dto: T) => void;
}
