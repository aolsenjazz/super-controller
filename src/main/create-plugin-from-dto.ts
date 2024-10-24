import {
  importDeviceSubcomponent,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import type { PluginDTO } from '@plugins/core/base-plugin';
import type { BaseInteractiveInputDriver } from '@shared/driver-types/input-drivers/base-interactive-input-driver';

export async function createInputPluginFromDTO(
  dto: PluginDTO,
  driver: BaseInteractiveInputDriver
) {
  const Plugin = await importInputSubcomponent(dto.title, 'plugin');
  return Plugin.fromDTO(dto, driver);
}

export async function createDevicePluginFromDTO(dto: PluginDTO) {
  const Plugin = await importDeviceSubcomponent(dto.title, 'plugin');
  return Plugin.fromDTO(dto);
}
