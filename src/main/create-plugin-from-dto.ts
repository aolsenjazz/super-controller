import {
  importDeviceSubcomponent,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';
import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers/mono-interactive-driver';
import { DRIVERS } from '@shared/drivers';
import { PluginDTO } from '@plugins/core/base-plugin';
import { inputIdFromDriver } from '@shared/util';

function findInputDriver(dto: PluginDTO) {
  const parts = dto.parentId.split('::');
  const deviceId = parts[0];
  const deviceName = deviceId.substring(0, deviceId.lastIndexOf(' '));
  const inputId = parts[1];

  const parentDriver = DRIVERS.get(deviceName);

  if (!parentDriver)
    throw new Error(`unable to locate device driver for id ${deviceName}`);

  const inputDriver = parentDriver.inputGrids
    .flatMap((g) => g.inputs)
    .filter((d) => d.interactive === true)
    .map((i) => i as InteractiveInputDriver)
    .find((d) => {
      return inputIdFromDriver(d) === inputId;
    });

  if (!inputDriver)
    throw new Error(`unable to located input driver for plugin id ${dto.id}`);

  if (!inputDriver.interactive)
    throw new Error(`lcoated driver for inputid ${inputId} is noninteractive!`);

  return inputDriver as MonoInteractiveDriver;
}

async function createInputPluginFromDTO(dto: PluginDTO) {
  const Plugin = await importInputSubcomponent(dto.title, 'plugin');
  return Plugin.fromDTO(dto, findInputDriver(dto));
}

async function createDevicePluginFromDTO(dto: PluginDTO) {
  const Plugin = await importDeviceSubcomponent(dto.title, 'plugin');
  return Plugin.fromDTO(dto);
}

export function createPluginFromDTO(dto: PluginDTO) {
  return dto.type === 'device'
    ? createDevicePluginFromDTO(dto)
    : createInputPluginFromDTO(dto);
}
