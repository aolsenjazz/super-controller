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
import { TRANSLATOR } from './ipc-channels';

/**
 * Exposes a means for the renderer process to communicate with the main process.
 */
const TranslatorService = {
  updateOverride(
    pluginId: string,
    source: NumberArrayWithStatus,
    override: NumberArrayWithStatus
  ) {
    ipcRenderer.send(TRANSLATOR.UPDATE_OVERRIDE, pluginId, source, override);
  },

  deleteOverride(pluginId: string, source: NumberArrayWithStatus) {
    ipcRenderer.send(TRANSLATOR.DELETE_OVERRIDE, pluginId, source);
  },
};

/**
 * Inject this service into the renderer process. No touchy
 */
contextBridge.exposeInMainWorld('TranslatorService', TranslatorService);

/**
 * Let the compiler know that this service is avaiable in renderer-living files
 */
declare global {
  interface Window {
    TranslatorService: typeof TranslatorService;
  }
}
