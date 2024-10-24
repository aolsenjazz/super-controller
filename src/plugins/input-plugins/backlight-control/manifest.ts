import type { MonoInteractiveDriver, BaseInputConfig } from '../../types';
import type { InputPluginManifest } from '../../core/input-plugin-manifest';

function colorCapableRequirement(config: BaseInputConfig): boolean {
  if (config.driver.interactive) {
    // in truth, there is no guarantee that this driver will be Mono.
    // casting to Mono in this case is harmless right now.
    const asMonoInteractive = config.driver as MonoInteractiveDriver;
    return asMonoInteractive.availableColors?.length > 0;
  }

  return false;
}

const Manifest: InputPluginManifest = {
  title: 'Backlight Control',
  description: 'Controls the color of the lights for this input.',
  gui: 'backlight-control/gui/BacklightControlPlugin.tsx',
  plugin: 'backlight-control/index.ts',
  requirements: [colorCapableRequirement],
};

export default Manifest;
