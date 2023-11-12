/* eslint global-require: off, no-console: off, promise/always-return: off */
import './ipc-manager';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { Lifecycle } from './lifecycle';

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

  // const installExtensions = async () => {
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
  // };
}

// start the background processes, load renderer, create menu bar
Lifecycle.start();
