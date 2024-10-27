import type { BasePlugin, PluginDTO } from '../../plugins/core/base-plugin';
import { Registry } from './registry';

export const PluginRegistry = new Registry<PluginDTO, BasePlugin>();
