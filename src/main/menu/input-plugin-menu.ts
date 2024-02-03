import { MenuItem } from 'electron';

import { ProjectProvider } from '@main/project-provider';
import { wp } from '@main/window-provider';
import { allInputPlugins } from '@plugins/plugin-utils';
import { Registry } from '@plugins/registry';
import {
  AdapterDeviceConfig,
  MonoInputConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';

export function createInputPluginMenu(deviceId: string, inputId: string) {
  return allInputPlugins().map((Plugin) => {
    return new MenuItem({
      label: Plugin.TITLE(),
      toolTip: Plugin.DESCRIPTION(),
      click: () => {
        const dev = ProjectProvider.project.getDevice(deviceId);

        if (
          dev instanceof SupportedDeviceConfig ||
          dev instanceof AdapterDeviceConfig
        ) {
          const input = dev.getInputById(inputId);

          if (input instanceof MonoInputConfig) {
            const plug = new Plugin();
            input.addPlugin(plug);
            Registry.register(plug);
            wp.MainWindow.sendConfigStub(dev.id, dev.stub());
          } else {
            console.log('Ignoring for now....');
          }

          wp.MainWindow.sendInputConfig(deviceId, inputId, input);
        }
      },
    });
  });
}
