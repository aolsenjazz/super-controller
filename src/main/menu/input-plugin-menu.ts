import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { Registry } from '@plugins/registry';
import {
  getInputManifests,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import {
  AdapterDeviceConfig,
  MonoInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { BasePlugin } from '@shared/plugin-core/base-plugin';

const { MainWindow } = wp;

export async function createInputPluginMenu(
  deviceId: string,
  inputIds: string[]
) {
  const manifests = await getInputManifests();

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: async () => {
        const dev = ProjectProvider.project.getDevice(deviceId);

        if (
          dev instanceof SupportedDeviceConfig ||
          dev instanceof AdapterDeviceConfig
        ) {
          inputIds.forEach(async (id) => {
            const input = dev.getInputById(id);

            if (input instanceof MonoInputConfig) {
              const Plugin = await importInputSubcomponent(m.title, 'plugin');
              const plugin: BasePlugin = new Plugin(m.title, m.description);
              input.plugins.push(plugin.id);
              Registry.register(plugin);

              MainWindow.sendInputConfig(deviceId, id, input.toDTO());
            } else {
              // TODO: How do we handle adding plugin to multi-input configs?
              // eslint-disable-next-line no-console
              console.log('Ignoring for now....');
            }
          });

          wp.MainWindow.sendConfigStub(dev.id, dev.toDTO());
        }
      },
    });
  });
}
