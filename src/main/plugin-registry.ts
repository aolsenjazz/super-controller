import type { BasePlugin } from '@shared/plugin-core/base-plugin';
import { Registry } from './registry';

export const PluginRegistry = new Registry<BasePlugin>();
