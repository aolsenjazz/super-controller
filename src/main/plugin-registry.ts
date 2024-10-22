import type { BasePlugin } from '@plugins/core/base-plugin';
import { Registry } from './registry';

export const PluginRegistry = new Registry<BasePlugin>();
