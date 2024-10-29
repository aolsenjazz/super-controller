import { MenuItem } from 'electron';

import type { BasePluginManifest } from '@plugins/core/base-plugin-manifest';
import { getAllDeviceManifests } from '@main/plugin-files';

export async function createDevicePluginMenu(
  onClick: (m: BasePluginManifest) => void,
) {
  const manifests = getAllDeviceManifests();

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: () => onClick(m),
    });
  });
}
