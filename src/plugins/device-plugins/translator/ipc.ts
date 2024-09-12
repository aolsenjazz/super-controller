import { ipcMain, IpcMainEvent } from 'electron';

import {
  AdapterDeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';

import { ProjectProvider } from '../../../main/project-provider';
// import { wp } from '../../../main/window-provider';

import { CONFIG } from '../../../main/ipc-channels';

// const { MainWindow } = wp;

ipcMain.on(
  CONFIG.GET_INPUT_CONFIG,
  (_e: IpcMainEvent, deviceId: string, _inputId: string) => {
    const { project } = ProjectProvider;
    const dConf = project.getDevice(deviceId);

    if (
      dConf instanceof SupportedDeviceConfig ||
      dConf instanceof AdapterDeviceConfig
    ) {
      // const iConf = dConf.getInputById(inputId);
      // if (iConf) {
      //   MainWindow.sendInputConfig(deviceId, inputId, iConf.config);
      // }
    }
  }
);

ipcMain.on(
  CONFIG.REQUEST_INPUT_CONFIG_STUB,
  (_e: IpcMainEvent, deviceId: string, _inputIds: string[]) => {
    const { project } = ProjectProvider;
    const conf = project.getDevice(deviceId);

    if (
      conf instanceof SupportedDeviceConfig ||
      conf instanceof AdapterDeviceConfig
    ) {
      // const configs = inputIds.map((i) => conf.getInputById(i)!.config);
      // MainWindow.sendInputConfigs(configs);
    }
  }
);
