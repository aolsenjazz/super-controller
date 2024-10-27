import type {
  DeviceConfig,
  DeviceConfigDTO,
} from '@shared/hardware-config/device-config';
import { Registry } from './registry';

export const DeviceRegistry = new Registry<DeviceConfigDTO, DeviceConfig>();
