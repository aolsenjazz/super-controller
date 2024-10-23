import { InteractiveInputDriver } from '../../driver-types/input-drivers';
import { KnobConfig } from './knob-config';
import { PadConfig } from './pad-config';
import { SliderConfig } from './slider-config';
import { PitchbendConfig } from './pitchbend-config';
import { SwitchConfig } from './switch-config';
import { XYConfig } from './xy-config';
import { BaseInputConfig, InputDTO } from './base-input-config';

import { DRIVERS } from '../../drivers';
import { inputIdFromDriver } from '../../util';
import { MonoInputDTO } from './mono-input-dto';
import { XYDriver } from '../../driver-types/input-drivers/xy-driver';
import { InputDriverWithHandle } from '../../driver-types/input-drivers/input-driver-with-handle';

function findDriver(config: InputDTO): InteractiveInputDriver {
  const splitIdx = config.deviceId.lastIndexOf(' ');
  const parentName = config.deviceId.substring(0, splitIdx);
  const parentDriver = DRIVERS.get(parentName);

  if (!parentDriver)
    throw new Error(`unable to locate driver for device id ${config.deviceId}`);

  const inputDriver = parentDriver.inputGrids
    .flatMap((g) => g.inputs)
    .filter((d) => d.interactive === true)
    .map((i) => i as InteractiveInputDriver)
    .find((d) => {
      return inputIdFromDriver(d) === config.id;
    });

  if (!inputDriver)
    throw new Error(`unable to located input driver for id ${config.id}`);

  return inputDriver;
}

function createXYConfig(other: InputDTO, d: XYDriver) {
  const XConfig = d.x.status === 'pitchbend' ? PitchbendConfig : SliderConfig;
  const YConfig = d.y.status === 'pitchbend' ? PitchbendConfig : SliderConfig;

  const x = new XConfig(other.id, '', [], d.x);
  const y = new YConfig(other.id, '', [], d.y);

  return new XYConfig(other.deviceId, other.nickname, d, x, y);
}

function createSliderOrWheelConfig(other: InputDTO, d: InputDriverWithHandle) {
  const asMono = other as MonoInputDTO;

  return asMono.defaults.statusString === 'pitchbend'
    ? new PitchbendConfig(other.deviceId, other.nickname, asMono.plugins, d)
    : new SliderConfig(other.deviceId, other.nickname, asMono.plugins, d);
}

export function inputConfigsFromDTO(other: InputDTO): BaseInputConfig {
  const d = findDriver(other);

  switch (d.type) {
    case 'xy':
      return createXYConfig(other, d);
    case 'switch':
      // TODO: do I need to create switch configs here?
      return new SwitchConfig(other.deviceId, other.nickname, d);
    case 'knob':
      return new KnobConfig(
        other.deviceId,
        other.nickname,
        (other as MonoInputDTO).plugins,
        d
      );
    case 'pad':
      return new PadConfig(
        other.deviceId,
        other.nickname,
        (other as MonoInputDTO).plugins,
        d
      );
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
    const XConfig = d.x.status === 'pitchbend' ? PitchbendConfig : SliderConfig;
    const YConfig = d.y.status === 'pitchbend' ? PitchbendConfig : SliderConfig;

    const x = new XConfig(deviceId, '', [], d.x);
    const y = new YConfig(deviceId, '', [], d.y);

    configs.push(new XYConfig(deviceId, '', d, x, y));
    configs.push(inputConfigsFromDriver(deviceId, d.x)[0]);
    configs.push(inputConfigsFromDriver(deviceId, d.y)[0]);
  } else if (d.type === 'switch') {
    const switchConfig = new SwitchConfig(deviceId, '', d);
    configs.push(switchConfig);
    configs.push(...switchConfig.steps);
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
