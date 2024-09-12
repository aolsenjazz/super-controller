/**
 * Standard electron preload file. This file exists in a sandboxed context, with the DOM
 * and a limited subset of Node APIs available to it. This preload file is automagically
 * packaged with webpack.
 *
 * Do not change this file's name, and do not remove the injection code at bottom of file.
 *
 * The main process' IPC listeners should exist inside of this respective service's index.ts file.
 */

import { contextBridge, ipcRenderer } from 'electron';
import { ShareSustainIcicle } from './index';
import { UPDATE_SHARE_SUSTAIN } from './ipc-channels';

/**
 * Exposes a service for the renderer process to communicate with the main process.
 */
const ShareSustainService = {
  update(icicle: ShareSustainIcicle) {
    ipcRenderer.send(UPDATE_SHARE_SUSTAIN, icicle);
  },
};

/**
 * Inject this service into the renderer process. No touchy
 */
contextBridge.exposeInMainWorld('ShareSustainService', ShareSustainService);

/**
 * Let the compiler know that this service is avaiable in renderer-living files
 */
declare global {
  interface Window {
    ShareSustainService: typeof ShareSustainService;
  }
}
