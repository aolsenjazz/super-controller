import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { BaseInputConfig } from '@shared/hardware-config/input-config/base-input-config';
import { MonoInputConfig } from '@shared/hardware-config/input-config/mono-input-config';

import { InputPluginManifest } from '@shared/plugin-core/input-plugin-manifest';

function colorCapableRequirement(config: BaseInputConfig): boolean {
  if (config instanceof MonoInputConfig && config.driver.interactive) {
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
