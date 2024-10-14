import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import BacklightControlPlugin from '@plugins/input-plugins/backlight-control';
import { PluginRegistry } from '@main/plugin-registry';
import { WindowProvider } from '@main/window-provider';

import { InteractiveInputDriver } from '../../driver-types/input-drivers';
import { KnobConfig } from './knob-config';
import { XYConfig } from './xy-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { SwitchConfig } from './switch-config';
import { PitchbendConfig } from './pitchbend-config';
import { MonoInputConfig } from './mono-input-config';

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
  if (d.type === 'xy') return new XYConfig(deviceId, '', d);
  if (d.type === 'switch') return new SwitchConfig(deviceId, '', d);

  let config: MonoInputConfig;

  if (d.type === 'knob') config = new KnobConfig(deviceId, '', [], d);
  else if (d.type === 'pad') config = new PadConfig(deviceId, '', [], d);
  else if (d.status === 'pitchbend')
    config = new PitchbendConfig(deviceId, '', [], d);
  else config = new SliderConfig(deviceId, '', [], d);

  const plugins = initPlugins(config.qualifiedId, d);
  plugins.forEach((p) => config.plugins.push(p));

  return config;
}
