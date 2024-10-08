import { InteractiveInputDriver } from '../../driver-types/input-drivers';

import { KnobConfig } from './knob-config';
import { XYConfig } from './xy-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { SwitchConfig } from './switch-config';
import { PitchbendConfig } from './pitchbend-config';

export function create(deviceId: string, d: InteractiveInputDriver) {
  switch (d.type) {
    case 'knob':
      return new KnobConfig(deviceId, '', d);
    case 'pad':
      return new PadConfig(deviceId, '', d);
    case 'wheel':
      return d.status === 'pitchbend'
        ? new PitchbendConfig(deviceId, '', d)
        : new SliderConfig(deviceId, '', d);
    case 'slider':
      return new SliderConfig(deviceId, '', d);
    case 'xy':
      return new XYConfig(deviceId, '', d);
    case 'switch':
      return new SwitchConfig(deviceId, '', d);
    default:
      throw new Error(`how did you do this`);
  }
}

export { BaseInputConfig } from './base-input-config';
export { MonoInputConfig } from './mono-input-config';
export {
  KnobConfig,
  PadConfig,
  XYConfig,
  SliderConfig,
  SwitchConfig,
  PitchbendConfig,
};
