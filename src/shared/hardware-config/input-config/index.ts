import { InteractiveInputDriver } from '../../driver-types/input-drivers';
import { KnobConfig } from './knob-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { PitchbendConfig } from './pitchbend-config';
import { SwitchConfig } from './switch-config';
import { XYConfig } from './xy-config';
import { BaseInputConfig } from './base-input-config';

export function inputConfigsFromDriver(
  deviceId: string,
  d: InteractiveInputDriver
) {
  const configs: BaseInputConfig[] = [];
  if (d.type === 'xy') {
    configs.push(new XYConfig(deviceId, '', d));
    configs.push(inputConfigsFromDriver(deviceId, d.x)[0]);
    configs.push(inputConfigsFromDriver(deviceId, d.y)[0]);
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

  return configs;
}
