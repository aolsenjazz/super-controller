import type { PluginDTO } from '../../plugin-core/base-plugin';
import type { InputIcicle } from './base-input-config';
import type { InputDefault } from './mono-input-config';

export interface MonoInputIcicle<T extends InputDefault = InputDefault>
  extends InputIcicle {
  defaults: T;
  colorCapable: boolean;
  plugins: PluginDTO[];
}
