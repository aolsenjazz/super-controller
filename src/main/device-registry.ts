import type { DeviceConfig } from '@shared/hardware-config/device-config';
import { Registry } from './registry';

export const DeviceRegistry = new Registry<DeviceConfig>();
