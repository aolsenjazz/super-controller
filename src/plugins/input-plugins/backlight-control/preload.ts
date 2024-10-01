import { contextBridge, ipcRenderer } from 'electron';
import { BacklightControlDTO } from '.';

const BacklightControlService = {
  updatePlugin: (dto: BacklightControlDTO) => {
    ipcRenderer.send('backlight-control-update', dto);
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
