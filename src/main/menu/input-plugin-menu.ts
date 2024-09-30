import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { Registry } from '@plugins/registry';
import {
  getInputManifests,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import { id as driverToId } from '@shared/util';
import {
  AdapterDeviceConfig,
  MonoInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { DRIVERS } from '@shared/drivers';
import { InteractiveInputDriver } from '@shared/driver-types';

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
        const devDriver = DRIVERS.get(dev.driverName)!;

        if (
          dev instanceof SupportedDeviceConfig ||
          dev instanceof AdapterDeviceConfig
        ) {
          inputIds.forEach(async (id) => {
            const input = dev.getInputById(id);

            const inputDriver = devDriver.inputGrids
              .flatMap((ig) => ig.inputs)
              .filter((i) => i.interactive === true)
              .map((i) => i as InteractiveInputDriver)
              .find((d) => driverToId(d) === id);

            if (input instanceof MonoInputConfig) {
              const Plugin = await importInputSubcomponent(m.title, 'plugin');
              const plugin: BaseInputPlugin = new Plugin(
                m.title,
                m.description,
                inputDriver!
              );
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
