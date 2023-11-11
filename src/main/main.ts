/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import os from 'os';
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util-main';
import { Background } from './background';

// TODO: Why on earth would we put this functionality in a class? just silly...
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// TODO: this shouldn't really be stored in a variable - just started
const background = new Background();
// TODO: this should be in a window manager
let mainWindow: BrowserWindow | null = null;

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
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (mainWindow !== null) return; // don't let users open more than 1 window

  // TODO: loooks like this prooooably should be done in app.whenReady()
  if (isDebug) {
    await installExtensions();
  }

  // TODO: these can really be moved up to top-level orrrrr to util-main
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 600,
    transparent: true,
    frame: false,
    minHeight: 312,
    minWidth: 850,
    titleBarStyle: os.platform() === 'darwin' ? 'hiddenInset' : 'default',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      contextIsolation: true,
      // TODO: for other loaded files, we create convenience methods. why not this one?
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize(); // TODO: figure out what to do about this. ugh
    } else {
      mainWindow.show();
      background.onDidFinishLoad(); // TODO: this should prooobably be gone
    }
  });

  mainWindow.on('closed', () => {
    background.onClosed();
    mainWindow = null;
  });

  // TODO: MenuBuilder holding a copy of the mainWindow and background is terrrible
  const menuBuilder = new MenuBuilder(mainWindow, background);
  // TODO: passing createWindow to buildMenu is crazy
  menuBuilder.buildMenu(createWindow);

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {}); // do nothing, continue to run

app.on('open-file', (_event: Event, filePath: string) => {
  if (mainWindow === null) createWindow();
  background.onOpenFile(filePath, true);
});

app.on('before-quit', (event) => {
  const shouldQuit = background.beforeQuit();
  if (!shouldQuit) {
    event.preventDefault();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
