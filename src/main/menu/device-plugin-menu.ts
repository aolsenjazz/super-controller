import { MenuItem } from 'electron';

import { getDeviceManifests } from '@plugins/plugin-loader';
import type { BasePluginManifest } from '@shared/plugin-core/base-plugin-manifest';

export async function createDevicePluginMenu(
  onClick: (m: BasePluginManifest) => void
) {
  const manifests = await getDeviceManifests();

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: () => onClick(m),
    });
  });
}
