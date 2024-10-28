// input plugins
import BacklightControlManifest from '@plugins/input-plugins/backlight-control/manifest';
import BacklightControlUI from '@plugins/input-plugins/backlight-control/gui/BacklightControlPlugin';

import BasicOverrideManifest from '@plugins/input-plugins/basic-override/manifest';
import BasicOverrideUI from '@plugins/input-plugins/basic-override/gui/BasicOverridePlugin';

// device plugins
import TranslatorManifest from '@plugins/device-plugins/translator/manifest';
import TranslatorUI from '@plugins/device-plugins/translator/gui/TranslatorPlugin';

import ShareSustainManifest from '@plugins/device-plugins/share-sustain/manifest';
import ShareSustainUI from '@plugins/device-plugins/share-sustain/renderer/ShareSustainPlugin';

import { BasePluginManifest } from '@plugins/core/base-plugin-manifest';
import { PluginUIProps } from '@plugins/core/plugin-ui-props';
import { PluginDTO } from '@plugins/core/base-plugin';

// make manifests findable via plugin title
const ManifestMap = new Map<string, BasePluginManifest>();
ManifestMap.set(ShareSustainManifest.title, ShareSustainManifest);
ManifestMap.set(BasicOverrideManifest.title, BasicOverrideManifest);
ManifestMap.set(TranslatorManifest.title, TranslatorManifest);
ManifestMap.set(BacklightControlManifest.title, BacklightControlManifest);

export function getManifest(title: string) {
  return ManifestMap.get(title);
}

export function getAllManifests() {
  return Array.from(ManifestMap.values());
}

// keep the compiler happy by putting these in a map, retrieve via getPluginUI()
const UIMap = new Map();
UIMap.set(ShareSustainManifest.title, ShareSustainUI);
UIMap.set(BasicOverrideManifest.title, BasicOverrideUI);
UIMap.set(TranslatorManifest.title, TranslatorUI);
UIMap.set(BacklightControlManifest.title, BacklightControlUI);

export function getPluginUI<T extends PluginDTO = PluginDTO>(
  title: string
): (props: PluginUIProps<T>) => JSX.Element {
  return UIMap.get(title);
}
