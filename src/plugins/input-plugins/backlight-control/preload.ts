import { contextBridge, ipcRenderer } from 'electron';

import { Color } from '@shared/driver-types/color';
import { FxDriver } from '@shared/driver-types/fx-driver';

const BacklightControlService = {
  updateColor: (pluginId: string, state: number, color: Color) => {
    ipcRenderer.send('backlight-control-update-color', pluginId, state, color);
  },

  updateFx: (pluginId: string, state: number, fx: FxDriver) => {
    ipcRenderer.send('backlight-control-update-fx', pluginId, state, fx);
  },

  updateFxValue: (pluginId: string, state: number, fxArr: MidiNumber[]) => {
    ipcRenderer.send(
      'backlight-control-update-fx-value',
      pluginId,
      state,
      fxArr
    );
  },
};

/**
 * Inject this service into the renderer process. No touchy
 */
contextBridge.exposeInMainWorld(
  'BacklightControlService',
  BacklightControlService
);

/**
 * Let the compiler know that this service is avaiable in renderer-living files
 */
declare global {
  interface Window {
    BacklightControlService: typeof BacklightControlService;
  }
}
