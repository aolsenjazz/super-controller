import type { PluginIcicle } from '@plugins/base-plugin';
import type { InputIcicle } from './base-input-config';
import type { InputDefault } from './mono-input-config';

export interface MonoInputIcicle<T extends InputDefault = InputDefault>
  extends InputIcicle {
  defaults: T;
  colorCapable: boolean;
  plugins: PluginIcicle[];
}
