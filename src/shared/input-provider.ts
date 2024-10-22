import type { BaseInputConfig } from './hardware-config/input-config/base-input-config';

export interface InputProvider {
  get: (qualifiedId: string) => BaseInputConfig | undefined;
}
