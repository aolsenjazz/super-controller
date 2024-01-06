import {
  InteractiveInputDriver,
  KnobDriver,
  PadDriver,
  InputDriverWithHandle,
  SwitchDriver,
  XYDriver,
} from '../../driver-types';

import { KnobConfig } from './knob-config';
import { XYConfig } from './xy-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { SwitchConfig } from './switch-config';
import { PitchbendConfig } from './pitchbend-config';

export function create(d: InteractiveInputDriver) {
  switch (d.type) {
    case 'knob':
      return KnobConfig.fromDriver(d as KnobDriver);
    case 'pad':
      return PadConfig.fromDriver(d as PadDriver);
    case 'wheel':
    case 'slider':
      // eslint-disable-next-line no-case-declarations
      const wheel = d as InputDriverWithHandle;
      return wheel.status === 'pitchbend'
        ? PitchbendConfig.fromDriver(wheel)
        : SliderConfig.fromDriver(wheel);
    case 'xy':
      return XYConfig.fromDriver(d as XYDriver);
    case 'switch':
      return SwitchConfig.fromDriver(d as SwitchDriver);
    default:
      throw new Error(`unrecognized driver type ${d.type}`);
  }
}

export { BaseInputConfig } from './base-input-config';
export { MonoInputConfig } from './mono-input-config';
export { LightCapableInputConfig } from './light-capable-input-config';
export {
  KnobConfig,
  PadConfig,
  XYConfig,
  SliderConfig,
  SwitchConfig,
  PitchbendConfig,
};
