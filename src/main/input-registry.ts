import type {
  BaseInputConfig,
  InputDTO,
} from '@shared/hardware-config/input-config/base-input-config';
import { Registry } from './registry';

/**
 * Normalized store of `InputConfig`s. Objects must be stored and retrieved
 * using the qualifiedId of inputConfigs.
 */
export const InputRegistry = new Registry<InputDTO, BaseInputConfig>();
