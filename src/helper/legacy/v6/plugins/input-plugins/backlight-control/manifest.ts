import type { MonoInteractiveDriver, BaseInputConfig } from '../../types';
import type { InputPluginManifest } from '../../core/input-plugin-manifest';

function colorCapableRequirement(config: BaseInputConfig): boolean {
  if (config.driver.interactive) {
    const asMonoInteractive = config.driver as MonoInteractiveDriver;
    return asMonoInteractive.availableColors.length > 0;
  }

  return false;
}

const Manifest: InputPluginManifest = {
  title: 'Backlight Control',
  description: 'Controls the color of the lights for this input.',
  gui: 'backlight-control/gui/gui.tsx',
  plugin: 'backlight-control/index.ts',
  requirements: [colorCapableRequirement],
};

export default Manifest;
