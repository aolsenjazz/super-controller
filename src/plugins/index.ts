import type { PluginManifest } from '@plugins/plugin-manifest';
import { waitForArray } from '@shared/util';

/**
 * List of available device plugin manifests, used for subcomponent discovery + import
 */
const deviceManifests: PluginManifest[] = [];

/**
 * List of available input plugin manifests, used for subcomponent discovery + import
 */
const inputManifests: PluginManifest[] = [];

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

export async function importDeviceSubcomponent(
  pluginTitle: string,
  subcomponent: 'gui' | 'plugin' | 'ipc'
) {
  const manifests = await getDeviceManifests();

  const manifest = manifests.find((m) => m.title === pluginTitle);
  if (manifest !== undefined) {
    return import(`./device-plugins/${manifest[subcomponent]}`);
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
