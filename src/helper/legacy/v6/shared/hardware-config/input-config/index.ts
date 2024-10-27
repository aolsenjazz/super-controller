import { InteractiveInputDriver } from '../../driver-types/input-drivers';
import { KnobConfig } from './knob-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { PitchbendConfig } from './pitchbend-config';
import { SwitchConfig, SwitchDTO } from './switch-config';
import { XYConfig, XYDTO } from './xy-config';
import { BaseInputConfig, InputDTO } from './base-input-config';

import { inputIdFromDriver } from '../../util';
import { MonoInputDTO } from './mono-input-dto';
import { InputDriverWithHandle } from '../../driver-types/input-drivers/input-driver-with-handle';
import { DeviceDriver } from '../../driver-types/device-driver';

function findDriver(
  parentDriver: DeviceDriver,
  config: InputDTO
): InteractiveInputDriver {
  if (!parentDriver)
    throw new Error(`unable to locate driver for device id ${config.deviceId}`);

  const inputDriver = parentDriver.inputGrids
    .flatMap((g) => g.inputs)
    .filter((d) => d.interactive === true)
    .map((i) => i as InteractiveInputDriver)
    .find((d) => {
      return inputIdFromDriver(d) === config.id;
    });

  if (!inputDriver) {
    throw new Error(`unable to locate input driver for id ${config.id}`);
  }

  return inputDriver;
}

function createSliderOrWheelConfig(other: InputDTO, d: InputDriverWithHandle) {
  const asMono = other as MonoInputDTO;

  return asMono.defaults.statusString === 'pitchbend'
    ? new PitchbendConfig(other.deviceId, other.nickname, asMono.plugins, d)
    : new SliderConfig(other.deviceId, other.nickname, asMono.plugins, d);
}

export function inputConfigsFromDTO(
  parentDriver: DeviceDriver,
  other: InputDTO
): BaseInputConfig {
  const d = findDriver(parentDriver, other);

  switch (d.type) {
    case 'xy':
      return new XYConfig(other.deviceId, other.nickname, d, other as XYDTO);
    case 'switch':
      return new SwitchConfig(
        other.deviceId,
        other.nickname,
        d,
        (other as SwitchDTO).steps
      );
    case 'knob':
      return new KnobConfig(other.deviceId, other.nickname, other.plugins, d);
    case 'pad':
      return new PadConfig(other.deviceId, other.nickname, other.plugins, d);
    case 'slider':
    case 'wheel': {
      return createSliderOrWheelConfig(other, d);
    }
    default:
      throw new Error(`unaccounted for input ${JSON.stringify(other)}`);
  }
}

export function inputConfigsFromDriver(
  deviceId: string,
  d: InteractiveInputDriver
) {
  const configs: BaseInputConfig[] = [];
  if (d.type === 'xy') {
    configs.push(new XYConfig(deviceId, '', d));
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
