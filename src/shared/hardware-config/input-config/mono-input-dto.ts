import type { InputDTO } from './base-input-config';
import type { InputDefault } from './mono-input-config';

export interface MonoInputDTO<T extends InputDefault = InputDefault>
  extends InputDTO {
  defaults: T;
  colorCapable: boolean;
  deviceId: string;
  id: string;
}
