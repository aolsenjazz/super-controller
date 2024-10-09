import { MenuItem } from 'electron';

import { getDeviceManifests } from '@plugins/plugin-loader';
import type { PluginManifest } from '@shared/plugin-core/plugin-manifest';

export async function createDevicePluginMenu(
  onClick: (m: PluginManifest) => void
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
