import { MenuItem } from 'electron';

import { WindowProvider } from '@main/window-provider';
import {
  getInputManifests,
  importInputSubcomponent,
} from '@plugins/plugin-loader';
import { MonoInputConfig } from '@shared/hardware-config';
import { BaseInputPlugin } from '@shared/plugin-core/base-input-plugin';
import { PluginRegistry } from '@main/plugin-registry';
import { InputRegistry } from '@main/input-registry';
import { PluginManifest } from '@shared/plugin-core/plugin-manifest';

const { MainWindow } = WindowProvider;

export async function createInputPluginMenu(qualifiedInputId: string) {
  const manifests = await getInputManifests();

  const onClick = async (m: PluginManifest) => {
    const input = InputRegistry.get(qualifiedInputId);

    if (!(input instanceof MonoInputConfig))
      throw new Error(`Adding plugin to ${input} is not defined`);

    const inputDriver = input.driver;
    const Plugin = await importInputSubcomponent(m.title, 'plugin');
    const plugin: BaseInputPlugin = new Plugin(
      m.title,
      m.description,
      inputDriver
    );
    input.plugins.push(plugin.id);

    PluginRegistry.register(plugin.id, plugin);
    MainWindow.sendReduxEvent({
      type: 'inputConfigs/upsertOne',
      payload: input.toDTO(),
    });
  };

  return manifests.map((m) => {
    return new MenuItem({
      label: m.title,
      toolTip: m.description,
      click: () => onClick(m),
    });
  });
}
