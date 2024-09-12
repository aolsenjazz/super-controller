import type { PluginManifest } from '@plugins/plugin-manifest';
import { waitForArray } from '@shared/util';
import { BasePlugin } from './base-plugin';
import { PluginUIProps } from './plugin-ui-props';

/**
 * List of available device plugin manifests, used for subcomponent discovery + import
 */
const deviceManifests: PluginManifest[] = [];

/**
 * List of available input plugin manifests, used for subcomponent discovery + import
 */
const inputManifests: PluginManifest[] = [];

/**
 * Manifests need to be loaded different depending on the environment. When code is running
 * on Node, loads manifests appropriately.
 */
async function loadManifestsNode() {
  const path = await import('path');
  const fs = await import('fs');

  function loadManifests(type: 'device' | 'input') {
    const target = type === 'device' ? deviceManifests : inputManifests;
    const pluginsDir = path.resolve(__dirname, `${type}-plugins`);
    const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true });

    pluginDirs
      .filter((d) => d.isDirectory())
      .map((d) => path.join(pluginsDir, d.name, 'manifest.json'))
      .filter((p) => fs.existsSync(p))
      .forEach(async (m) => {
        const manifest = await import(`${m}`);
        target.push(manifest);
      });
  }

  loadManifests('input');
  loadManifests('device');
}

/**
 * Manifests need to be loaded different depending on the environment. When code is running
 * in Browser, loads manifests appropriately.
 */
async function loadManifestsBrowser() {
  const deviceContext = require.context(
    '@plugins/device-plugins',
    true,
    /manifest.json/,
    'lazy'
  );
  const inputContext = require.context(
    '@plugins/input-plugins',
    true,
    /manifest.json/,
    'lazy'
  );

  deviceContext.keys().forEach((path) =>
    deviceContext(path).then((m: PluginManifest) => {
      deviceManifests.push(m);
      return null;
    })
  );

  inputContext.keys().forEach((path) =>
    inputContext(path).then((m: PluginManifest) => {
      deviceManifests.push(m);
      return null;
    })
  );
}

// if loading in Node, use Node APIs. otherwise, renderer APIs
if (globalThis.window !== undefined) {
  loadManifestsBrowser();
} else {
  loadManifestsNode();
}

export async function getDeviceManifests() {
  await waitForArray(deviceManifests);
  return deviceManifests;
}

export async function getInputManifests() {
  await waitForArray(inputManifests);
  return inputManifests;
}

type ComponentType<T extends 'gui' | 'plugin' | 'ipc'> = T extends 'gui'
  ? React.FC<PluginUIProps>
  : T extends 'plugin'
  ? new (...args: any[]) => BasePlugin
  : T extends 'ipc'
  ? any
  : never;

export async function importDeviceSubcomponent<
  T extends 'gui' | 'ipc' | 'plugin'
>(pluginTitle: string, subcomponent: T) {
  const manifests = await getDeviceManifests();

  const manifest = manifests.find((m) => m.title === pluginTitle);
  if (manifest !== undefined) {
    const { default: Import } = await import(
      `./device-plugins/${manifest[subcomponent]}`
    );
    return Import as ComponentType<T>;
  }

  throw new Error(
    `unable to import device plugin subcomponent: ${subcomponent}`
  );
}

export async function importInputSubcomponent(
  pluginTitle: string,
  subcomponent: 'gui' | 'plugin' | 'ipc'
) {
  const manifests = await getInputManifests();

  const manifest = manifests.find((m) => m.title === pluginTitle);
  if (manifest !== undefined) {
    return import(`./input-plugins/${manifest[subcomponent]}`);
  }

  throw new Error(
    `unable to import input plugin subcomponent: ${subcomponent}`
  );
}
