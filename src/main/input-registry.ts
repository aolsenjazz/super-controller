import type { BaseInputConfig } from '@shared/hardware-config/input-config/base-input-config';
import { Registry } from './registry';

export const InputRegistry = new Registry<BaseInputConfig>();
