const deviceContext = require.context(
  '@plugins/device-plugins',
  true,
  /manifest.json/,
  'lazy'
);

type DeviceManifest = {
  gui: string;
  plugin: string;
  ipc: string;
  title: string;
  description: string;
};

const deviceManifests: DeviceManifest[] = [];

deviceContext.keys().forEach((path) =>
  deviceContext(path).then((m: DeviceManifest) => {
    deviceManifests.push(m);
    return null;
  })
);

export async function importDeviceGUI(pluginTitle: string) {
  // if for some reason manifests haven't yet been loaded, wait
  let retries = 0;
  await new Promise((resolve, reject) => {
    function checkArr() {
      if (retries === 3) {
        reject(new Error('Unable to load plugin manifests'));
      }

      if (deviceManifests.length > 0) {
        resolve(null);
      } else {
        retries++;
        setTimeout(checkArr, 100);
      }
    }

    checkArr();
  });

  const manifest = deviceManifests.find((m) => m.title === pluginTitle);
  if (manifest !== undefined) {
    return import(`../../../plugins/device-plugins/${manifest.gui}`);
  }

  throw new Error('unable to import device plugin GUI');
}
