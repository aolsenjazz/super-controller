import { InputRegistryWithSubregistry } from './input-registry-with-subregistry';

/**
 * Normalized store of `InputConfig`s. Objects must be stored and retrieved
 * using the qualifiedId of inputConfigs.
 */
export const InputRegistry = new InputRegistryWithSubregistry();
