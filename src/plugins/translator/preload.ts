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

import { MidiArray } from '@shared/midi-array';

import { TRANSLATOR } from '../../main/ipc-channels';
import { addOnChangeListener } from '../../main/preload/common';

/**
 * Exposes a means for the renderer process to communicate with the main process.
 */
const TranslatorService = {
  removeTranslatorOverride(deviceId: string, action: NumberArrayWithStatus) {
    ipcRenderer.send(TRANSLATOR.REMOVE_TRANSLATOR_OVERRIDE, deviceId, action);
  },
  addTranslatorOverride(
    deviceId: string,
    action: NumberArrayWithStatus,
    statusString: StatusString,
    channel: Channel,
    number: MidiNumber,
    value: MidiNumber
  ) {
    ipcRenderer.send(
      TRANSLATOR.ADD_TRANSLATOR_OVERRIDE,
      deviceId,
      action,
      statusString,
      channel,
      number,
      value
    );
  },
  getTranslatorOverride(
    deviceId: string,
    action: NumberArrayWithStatus
  ): NumberArrayWithStatus | undefined {
    return ipcRenderer.sendSync(
      TRANSLATOR.GET_TRANSLATOR_OVERRIDE,
      deviceId,
      action
    );
  },
  onOverridesChange(
    deviceId: string,
    func: (overrides: Map<string, MidiArray>) => void
  ) {
    const off = addOnChangeListener(`${deviceId}-overrides`, func);
    ipcRenderer.send(TRANSLATOR.REQUEST_OVERRIDES, deviceId);
    return off;
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
