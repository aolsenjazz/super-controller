import { MenuItem } from 'electron';

import { getInputManifests } from '@plugins/plugin-loader';
import { PluginManifest } from '@shared/plugin-core/plugin-manifest';

export async function createInputPluginMenu(
  onClick: (m: PluginManifest) => void
) {
  const manifests = await getInputManifests();

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: () => onClick(m),
    });
  });
}
