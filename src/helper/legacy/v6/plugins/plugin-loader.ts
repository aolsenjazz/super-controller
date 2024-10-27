import type { BaseInputDriver, BaseInteractiveInputDriver } from './types';
import type { BasePluginManifest } from './core/base-plugin-manifest';
import type { InputPluginManifest } from './core/input-plugin-manifest';
import type { BaseDevicePlugin } from './core/base-device-plugin';
import type { PluginDTO } from './core/base-plugin';
import type { PluginUIProps } from './core/plugin-ui-props';
import type { BaseInputPlugin } from './core/base-input-plugin';

/**
 * Waits for an array to be non-empty. Useful for making sure that we have discovered all
 * plugin manifests before we try to access them.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function waitForArray(arr: any[], interval = 100, retries = 3) {
  let r = 0;
  await new Promise((resolve, reject) => {
    function checkArr() {
      if (r === retries) {
        reject(new Error('Unable to load plugin manifests'));
      }

      if (arr.length > 0) {
        resolve(null);
      } else {
        r++;
        setTimeout(checkArr, interval);
      }
    }

    checkArr();
  });
}

/**
 * List of available device plugin manifests, used for subcomponent discovery + import
 */
const deviceManifests: BasePluginManifest[] = [];

/**
 * List of available input plugin manifests, used for subcomponent discovery + import
 */
const inputManifests: InputPluginManifest[] = [];

/**
 * Manifests need to be loaded different depending on the environment. When code is running
 * on Node, loads manifests appropriately.
 */
async function loadManifestsNode() {
  const path = await import('path');
  const fs = await import('fs');

  function loadManifests(type: 'device' | 'input') {
    const target = type === 'device' ? deviceManifests : inputManifests;
    const pluginsDir = path.resolve(__dirname, `./${type}-plugins`);
    const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true });

    pluginDirs
      .filter((d) => d.isDirectory())
      .map((d) => path.join(pluginsDir, d.name, 'manifest.ts'))
      .filter((p) => fs.existsSync(p))
      .forEach(async (m) => {
        const manifest = await import(`${m}`);
        target.push(manifest.default);
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
    /manifest.ts/,
    'lazy'
  );
  const inputContext = require.context(
    '@plugins/input-plugins',
    true,
    /manifest.ts/,
    'lazy'
  );

  deviceContext.keys().forEach((path) =>
    deviceContext(path).then((m: { default: BasePluginManifest }) => {
      deviceManifests.push(m.default);
      return null;
    })
  );

  inputContext.keys().forEach((path) =>
    inputContext(path).then((m: { default: InputPluginManifest }) => {
      inputManifests.push(m.default);
      return null;
    })
  );
}

// if loading in Node, use Node APIs. otherwise, renderer APIs
if (
  globalThis.window !== undefined &&
  typeof globalThis.afterAll !== 'function'
) {
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

type DevicePluginConstructorWithStatic = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): BaseDevicePlugin;
  fromDTO: (dto: PluginDTO) => BaseDevicePlugin;
};

type DeviceComponentType<T extends 'gui' | 'plugin' | 'ipc'> = T extends 'gui'
  ? React.FC<PluginUIProps>
  : T extends 'plugin'
  ? DevicePluginConstructorWithStatic
  : T extends 'ipc'
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
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
    return Import as DeviceComponentType<T>;
  }

  throw new Error(
    `unable to import device plugin subcomponent: ${subcomponent}`
  );
}

type InputComponentArgs = [parentId: string, driver: BaseInputDriver];

type InputPluginConstructorWithStatic = {
  new (...args: InputComponentArgs): BaseInputPlugin;
  fromDTO: (
    dto: PluginDTO,
    driver: BaseInteractiveInputDriver
  ) => BaseInputPlugin;
};

type InputComponentType<T extends 'gui' | 'plugin' | 'ipc'> = T extends 'gui'
  ? React.FC<PluginUIProps>
  : T extends 'plugin'
  ? InputPluginConstructorWithStatic
  : T extends 'ipc'
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  : never;

export async function importInputSubcomponent<
  T extends 'gui' | 'ipc' | 'plugin'
>(pluginTitle: string, subcomponent: T) {
  const manifests = await getInputManifests();

  const manifest = manifests.find((m) => m.title === pluginTitle);
  if (manifest !== undefined) {
    const { default: Import } = await import(
      `./input-plugins/${manifest[subcomponent]}`
    );

    return Import as InputComponentType<T>;
  }

  throw new Error(
    `unable to import input plugin subcomponent: ${subcomponent}`
  );
}
