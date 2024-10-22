import { DeviceConfigDTO } from './hardware-config/device-config';
import { InputDTO } from './hardware-config/input-config/base-input-config';
import { PluginDTO } from './plugin-core/base-plugin';

export interface ProjectPOJO {
  inputs: InputDTO[];
  devices: DeviceConfigDTO[];
  plugins: PluginDTO[];
  version: number;
}
