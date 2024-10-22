import { BaseInputConfig } from '../types';
import { BasePluginManifest } from './base-plugin-manifest';

export interface InputPluginManifest extends BasePluginManifest {
  /**
   * Runs the following functions against the target input driver to determine
   * whether or not this plugin can be applied to this input.
   *
   * E.g. driver.availableColors.length > 0 for BacklightConfigPlugin
   */
  requirements: ((config: BaseInputConfig) => boolean)[];
}
