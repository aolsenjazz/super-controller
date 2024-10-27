import type { DeviceConfigDTO } from './hardware-config/device-config';
import type { InputDTO } from './hardware-config/input-config/base-input-config';
import type { PluginDTO } from '../plugins/core/base-plugin';

export interface ProjectPOJO {
  inputs: Record<string, InputDTO>;
  devices: Record<string, DeviceConfigDTO>;
  plugins: Record<string, PluginDTO>;
  version: number;
}
