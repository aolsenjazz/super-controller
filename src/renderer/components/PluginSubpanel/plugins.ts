/**
 * Webpack context with which we search for device plugins
 */
const deviceContext = require.context(
  '@plugins/device-plugins',
  true,
  /manifest.json/,
  'lazy'
);

/**
 * TODO: this will very soon move into the plugins folder
 */
type DeviceManifest = {
  gui: string;
  plugin: string;
  ipc: string;
  title: string;
  description: string;
};

/**
 * List of available device plugin manifests, used for subcomponent discovery + import
 */
const deviceManifests: DeviceManifest[] = [];
deviceContext.keys().forEach((path) =>
  deviceContext(path).then((m: DeviceManifest) => {
    deviceManifests.push(m);
    return null;
  })
);

/**
 * Waits for an array to be non-empty. Useful for making sure that we have discovered all
 * plugin manifests before we try to access them.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function waitForArray(arr: any[], interval = 100, retries = 3) {
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
 * Dynamically import a device plugin GUI based on the title of the plugin. Throws if unable
 * to find manifests or the plugin GUI
 */
export async function importDeviceGUI(pluginTitle: string) {
  await waitForArray(deviceManifests);

  const manifest = deviceManifests.find((m) => m.title === pluginTitle);
  if (manifest !== undefined) {
    return import(`../../../plugins/device-plugins/${manifest.gui}`);
  }

  throw new Error('unable to import device plugin GUI');
}
