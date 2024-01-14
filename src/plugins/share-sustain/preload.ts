/**
 * Standard electron preload file. This file exists in a sandboxed context, with the DOM
 * and a limited subset of Node APIs available to it. This preload file is automagically
 * packaged with webpack, however, we still need to do the injection and global window
 * extension in every individual preload file.
 *
 * Do not change this file's name, and do not remove the injection code at bottom of file.
 *
 * The main process' IPC listeners should exist inside of this respective service's index.ts file.
 */

import { contextBridge, ipcRenderer } from 'electron';
import { ADD_SUSTAIN_TARGET, REMOVE_SUSTAIN_TARGET } from './ipc-channels';

/**
 * Exposes a means for the renderer process to communicate with the main process.
 */
const ShareSustainService = {
  addSustainTarget(pluginId: string, targetConfigId: string) {
    ipcRenderer.send(ADD_SUSTAIN_TARGET, pluginId, targetConfigId);
  },

  removeSustainTarget(pluginId: string, targetConfigId: string) {
    ipcRenderer.send(REMOVE_SUSTAIN_TARGET, pluginId, targetConfigId);
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
