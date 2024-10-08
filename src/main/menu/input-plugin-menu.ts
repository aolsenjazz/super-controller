import { MenuItem } from 'electron';

import { WindowProvider } from '@main/window-provider';
import {
  getInputManifests,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import { getQualifiedInputId, inputIdFromDriver } from '@shared/util';
import { MonoInputConfig } from '@shared/hardware-config';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { DRIVERS } from '@shared/drivers';
import { InteractiveInputDriver } from '@shared/driver-types';
import { PluginRegistry } from '@main/plugin-registry';
import { InputRegistry } from '@main/input-registry';
import { DeviceRegistry } from '@main/device-registry';

const { MainWindow } = WindowProvider;

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
        const dev = DeviceRegistry.get(deviceId)!;
        const devDriver = DRIVERS.get(dev.driverName)!;

        inputIds.forEach(async (id) => {
          const input = InputRegistry.get(getQualifiedInputId(deviceId, id));

          const inputDriver = devDriver.inputGrids
            .flatMap((ig) => ig.inputs)
            .filter((i) => i.interactive === true)
            .map((i) => i as InteractiveInputDriver)
            .find((d) => inputIdFromDriver(d) === id);

          if (input instanceof MonoInputConfig) {
            const Plugin = await importInputSubcomponent(m.title, 'plugin');
            const plugin: BaseInputPlugin = new Plugin(
              m.title,
              m.description,
              inputDriver!
            );
            input.plugins.push(plugin.id);
            PluginRegistry.register(plugin.id, plugin);

            MainWindow.sendReduxEvent({
              type: 'inputConfigs/upsertOne',
              payload: input.toDTO(),
            });
          } else {
            // TODO: How do we handle adding plugin to multi-input configs?
            // eslint-disable-next-line no-console
            console.log('Ignoring for now....');
          }
        });
      },
    });
  });
}
