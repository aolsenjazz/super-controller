/* eslint global-require: off, no-console: off, promise/always-return: off */
import './ipc-manager';
import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { WindowService as ws } from './window-service';
import { MenuProvider as mp } from './menu';
import { Background } from './background';

// TODO: Why on earth would we put this functionality in a class? just silly...
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// eslint-disable-next-line
new AppUpdater();

// TODO: node v12.12.0 comes with source map support built in - can't we remove this?
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  // TODO: as of 11/11/2023, this isn't working anyways (react's fault) should be fixed soon
  // const installer = require('electron-devtools-installer');
  // const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  // const extensions = ['REACT_DEVELOPER_TOOLS'];
  // return installer
  //   .default(
  //     extensions.map((name) => installer[name]),
  //     forceDownload
  //   )
  //   .catch(console.log);
};

app.on('window-all-closed', () => {}); // do nothing, continue to run

app.on('open-file', (_event: Event, filePath: string) => {
  // if (mainWindow === null) createWindow();
  Background.onOpenFile(filePath);
});

app.on('before-quit', (event) => {
  const shouldQuit = Background.beforeQuit();
  if (!shouldQuit) {
    event.preventDefault();
  }
});

app
  .whenReady()
  .then(async () => {
    mp.buildMenu(null);
    ws.createMainWindow();

    if (isDebug) await installExtensions();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      ws.createMainWindow();
    });
  })
  .catch(console.log);
