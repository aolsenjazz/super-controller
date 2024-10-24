import { DeviceConfigDTO } from './hardware-config/device-config';
import { InputDTO } from './hardware-config/input-config/base-input-config';
import { PluginDTO } from '../plugins/core/base-plugin';

export interface ProjectPOJO {
  inputs: Record<string, InputDTO>;
  devices: Record<string, DeviceConfigDTO>;
  plugins: Record<string, PluginDTO>;
  version: number;
}
