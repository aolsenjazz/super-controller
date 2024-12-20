import { MenuItem } from 'electron';

import { InputPluginManifest } from '@plugins/core/input-plugin-manifest';
import { BaseInputConfig } from '@shared/hardware-config/input-config/base-input-config';
import { getAllInputManifests } from '@main/plugin-files';

const incapableMsg = 'This plugin in incompatible with this input.';

export async function createInputPluginMenu(
  input: BaseInputConfig,
  onClick: (m: InputPluginManifest) => void,
) {
  const manifests = getAllInputManifests();

  return manifests.map((m) => {
    // only allow users to select a plugin if it fits all requirements, defined
    // in the manifest
    const enabled = !m.requirements
      .map((r) => r(input))
      .some((v) => v === false);

    return new MenuItem({
      label: m.title,
      toolTip: enabled ? m.description : incapableMsg,
      click: () => onClick(m),
      enabled,
    });
  });
}
