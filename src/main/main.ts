/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 *                        ___________________
 *                       |                   |
 *                       |      main.ts      |
 *                       |___________________|
 *                        _________|_________
 *                       |                   |
 *                       |    lifecycle.ts   |
 *                       |___________________|
 *  ___________________ / _________|_________ \ ___________________
 * |                   | |                   | |                   |
 * |       menu        | |   *-service.ts    | |     renderer      |
 * |___________________| |___________________| |___________________|
 *              __|_____________|__
 *             |                   |
 *             |   *-provider.ts   |
 *             |___________________|
 */

import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { Lifecycle } from './lifecycle';

// autoUpdated config
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.checkForUpdatesAndNotify();

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

Lifecycle.start();
