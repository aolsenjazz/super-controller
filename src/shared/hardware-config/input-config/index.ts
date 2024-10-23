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

/**
 * TODO: This function really could use a cleanup
 */
export function inputConfigsFromDTO(other: InputDTO): BaseInputConfig {
  let config: BaseInputConfig;
  const d = findDriver(other);

  if (d.type === 'xy') {
    const XConfig = d.x.status === 'pitchbend' ? PitchbendConfig : SliderConfig;
    const YConfig = d.y.status === 'pitchbend' ? PitchbendConfig : SliderConfig;

    const x = new XConfig(other.id, '', [], d.x);
    const y = new YConfig(other.id, '', [], d.y);

    config = new XYConfig(other.deviceId, other.nickname, d, x, y);
  } else if (d.type === 'switch') {
    config = new SwitchConfig(other.deviceId, other.nickname, d);
    // TODO: do I need to create switch configs here?
  } else if (d.type === 'knob') {
    config = new KnobConfig(
      other.deviceId,
      other.nickname,
      (other as MonoInputDTO).plugins,
      d
    );
  } else if (d.type === 'pad') {
    config = new PadConfig(
      other.deviceId,
      other.nickname,
      (other as MonoInputDTO).plugins,
      d
    );
  } else if (d.type === 'slider' || d.type === 'wheel') {
    const asMono = other as MonoInputDTO;

    if (asMono.defaults.statusString === 'pitchbend') {
      config = new PitchbendConfig(
        other.deviceId,
        other.nickname,
        asMono.plugins,
        d
      );
    } else {
      config = new SliderConfig(
        other.deviceId,
        other.nickname,
        asMono.plugins,
        d
      );
    }
  } else {
    throw new Error(`unaccounted for input ${JSON.stringify(other)}`);
  }

  return config;
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
