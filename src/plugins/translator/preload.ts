import { contextBridge, ipcRenderer } from 'electron';

import { MidiArray } from '@shared/midi-array';

import { TRANSLATOR } from '../../main/ipc-channels';
import { addOnChangeListener } from '../../main/preload/common';

/**
 * Contains IPC functions related to translators
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
 * Inject this service into the renderer process.
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
