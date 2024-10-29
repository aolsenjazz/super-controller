// Core imports
import { BasePluginManifest } from '@plugins/core/base-plugin-manifest';
import { PluginDTO } from '@plugins/core/base-plugin';
import { BaseInputPlugin } from '@plugins/core/base-input-plugin';
import { BaseDevicePlugin } from '@plugins/core/base-device-plugin';
import { InputPluginManifest } from '@plugins/core/input-plugin-manifest';
import { BaseInputDriver, BaseInteractiveInputDriver } from '@plugins/types';

// Input plugin imports
import BacklightControlManifest from '@plugins/input-plugins/backlight-control/manifest';
import BacklightControlPlugin from '@plugins/input-plugins/backlight-control/index';
import BasicOverrideManifest from '@plugins/input-plugins/basic-override/manifest';
import BasicOverridePlugin from '@plugins/input-plugins/basic-override/index';

// Device plugin imports
import TranslatorManifest from '@plugins/device-plugins/translator/manifest';
import TranslatorPlugin from '@plugins/device-plugins/translator/index';
import ShareSustainManifest from '@plugins/device-plugins/share-sustain/manifest';
import ShareSustainPlugin from '@plugins/device-plugins/share-sustain/index';

// manifests
const InputManifests = new Map<string, InputPluginManifest>();
InputManifests.set(BasicOverrideManifest.title, BasicOverrideManifest);
InputManifests.set(BacklightControlManifest.title, BacklightControlManifest);

const DeviceManifests = new Map<string, BasePluginManifest>();
DeviceManifests.set(ShareSustainManifest.title, ShareSustainManifest);
DeviceManifests.set(TranslatorManifest.title, TranslatorManifest);

export function getInputManifest(title: string) {
  return InputManifests.get(title);
}

export function getDeviceManifest(title: string) {
  return DeviceManifests.get(title);
}

export function getAllDeviceManifests() {
  return Array.from(DeviceManifests.values());
}

export function getAllInputManifests() {
  return Array.from(InputManifests.values());
}

// input plugins
type InputComponentArgs = [parentId: string, driver: BaseInputDriver];
type InputPluginConstructorWithStatic = {
  new (...args: InputComponentArgs): BaseInputPlugin;
  fromDTO: (
    dto: PluginDTO,
    driver: BaseInteractiveInputDriver,
  ) => BaseInputPlugin;
};

const InputPluginMap = new Map();
InputPluginMap.set(BacklightControlManifest.title, BacklightControlPlugin);
InputPluginMap.set(BasicOverrideManifest.title, BasicOverridePlugin);

export function getInputPlugin(
  title: string,
): InputPluginConstructorWithStatic {
  return InputPluginMap.get(title);
}

// device plugins
type DevicePluginConstructorWithStatic = {
  // TODO: fix this eventually
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): BaseDevicePlugin;
  fromDTO: (dto: PluginDTO) => BaseDevicePlugin;
};
const DevicePluginMap = new Map();
DevicePluginMap.set(TranslatorManifest.title, TranslatorPlugin);
DevicePluginMap.set(ShareSustainManifest.title, ShareSustainPlugin);

export function getDevicePlugin(
  title: string,
): DevicePluginConstructorWithStatic {
  return DevicePluginMap.get(title);
}
