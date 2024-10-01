import { ipcMain, IpcMainEvent } from 'electron';

import { Registry } from '@plugins/registry';
import { wp } from '@main/window-provider';

import BacklightControlPlugin, { BacklightControlDTO } from '.';

const { MainWindow } = wp;

ipcMain.addListener(
  'backlight-control-update',
  (_e: IpcMainEvent, dto: BacklightControlDTO) => {
    const plugin = Registry.get<BacklightControlPlugin>(dto.id);

    if (!plugin) throw new Error(`unable to find plugin for id ${dto.id}`);

    plugin.colorBindings = dto.colorBindings;
    plugin.fxBindings = dto.fxBindings;

    MainWindow.sendPluginUpdate(dto.id, plugin.toDTO());
  }
);
