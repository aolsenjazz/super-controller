import { PluginDTO } from '@shared/plugin-core/base-plugin';

export interface ShareSustainDTO extends PluginDTO {
  sustainTargets: string[];
}
