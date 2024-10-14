import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import BacklightControlPlugin from '@plugins/input-plugins/backlight-control';
import { PluginRegistry } from '@main/plugin-registry';
import { WindowProvider } from '@main/window-provider';
import { InputRegistry } from '@main/input-registry';

import { InteractiveInputDriver } from '../../driver-types/input-drivers';
import { KnobConfig } from './knob-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { PitchbendConfig } from './pitchbend-config';
import { BaseInputConfig } from './base-input-config';
import { SwitchConfig } from './switch-config';

const { MainWindow } = WindowProvider;

function initPlugins(qualifiedId: string, d: MonoInteractiveDriver) {
  const plugins: string[] = [];

  if (d.availableColors.length > 0) {
    const backlightPlugin = new BacklightControlPlugin(qualifiedId, d);
    PluginRegistry.register(backlightPlugin.id, backlightPlugin);
    plugins.push(backlightPlugin.id);

    MainWindow.upsertPlugin(backlightPlugin.toDTO());
  }

  return plugins;
}

export function create(deviceId: string, d: InteractiveInputDriver) {
  const configs: BaseInputConfig[] = [];
  if (d.type === 'xy') {
    configs.push(create(deviceId, d.x)[0]);
    configs.push(create(deviceId, d.y)[0]);
  } else if (d.type === 'switch') {
    configs.push(new SwitchConfig(deviceId, '', d));
  } else if (d.type === 'knob') {
    configs.push(new KnobConfig(deviceId, '', [], d));
  } else if (d.type === 'pad') {
    configs.push(new PadConfig(deviceId, '', [], d));
  } else if (d.status === 'pitchbend') {
    configs.push(new PitchbendConfig(deviceId, '', [], d));
  } else {
    configs.push(new SliderConfig(deviceId, '', [], d));
  }

  configs.forEach((c) => {
    const plugins = initPlugins(c.qualifiedId, c.driver);
    plugins.forEach((p) => c.plugins.push(p));
    InputRegistry.register(c.qualifiedId, c);
  });

  return configs;
}
