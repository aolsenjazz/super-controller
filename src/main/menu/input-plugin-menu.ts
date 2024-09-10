import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { INPUT_PLUGINS } from '@plugins/input-plugins';
import { Registry } from '@plugins/registry';
import {
  AdapterDeviceConfig,
  MonoInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';

export function createInputPluginMenu(deviceId: string, inputIds: string[]) {
  return Object.values(INPUT_PLUGINS).map((Plugin) => {
    return new MenuItem({
      label: Plugin.TITLE(),
      toolTip: Plugin.DESCRIPTION(),
      click: () => {
        const dev = ProjectProvider.project.getDevice(deviceId);

        if (
          dev instanceof SupportedDeviceConfig ||
          dev instanceof AdapterDeviceConfig
        ) {
          inputIds.forEach((id) => {
            const input = dev.getInputById(id);

            if (input instanceof MonoInputConfig) {
              const plug = new Plugin();
              input.addPlugin(plug);
              Registry.register(plug);
            } else {
              console.log('Ignoring for now....');
            }
          });

          wp.MainWindow.sendConfigStub(dev.id, dev.stub());
        }
      },
    });
  });
}
