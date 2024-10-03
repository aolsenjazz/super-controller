import { Registry } from './registry';
import type { BasePlugin } from '@shared/plugin-core/base-plugin';

export const PluginRegistry = new Registry<BasePlugin>();
