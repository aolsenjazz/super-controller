import { ipcMain, IpcMainEvent } from 'electron';

import { MidiArray } from '@shared/midi-array';
import {
  BaseInputConfig,
  InputConfigStub,
} from '@shared/hardware-config/input-config/base-input-config';
import {
  AdapterDeviceConfig,
  SupportedDeviceConfig,
} from '@shared/hardware-config';
import { idForConfigStub } from '@shared/util';

import { CONFIG } from '../../main/ipc-channels';
import { BasePlugin, PluginIcicle } from '../base-plugin';

import { wp } from '../../main/window-provider';
import { ProjectProvider } from '../../main/project-provider';
import { ImplementsBasePluginStatic } from '../base-plugin-static';

const { MainWindow } = wp;

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-interface
interface TranslatorIcicle extends PluginIcicle {}

@ImplementsBasePluginStatic()
export default class TranslatorPlugin extends BasePlugin<TranslatorIcicle> {
  static TITLE() {
    return 'Translator';
  }

  static DESCRIPTION() {
    return 'Temp Description';
  }

  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  protected initIpcListeners(): void {
    ipcMain.on(
      CONFIG.GET_INPUT_CONFIG,
      (_e: IpcMainEvent, deviceId: string, inputId: string) => {
        const { project } = ProjectProvider;
        const dConf = project.getDevice(deviceId);

        if (
          dConf instanceof SupportedDeviceConfig ||
          dConf instanceof AdapterDeviceConfig
        ) {
          const iConf = dConf.getInputById(inputId);

          if (iConf) {
            MainWindow.sendInputConfig(deviceId, inputId, iConf.config);
          }
        }
      }
    );

    ipcMain.on(
      CONFIG.REQUEST_INPUT_CONFIG_STUB,
      (_e: IpcMainEvent, deviceId: string, inputIds: string[]) => {
        const { project } = ProjectProvider;
        const conf = project.getDevice(deviceId);

        if (
          conf instanceof SupportedDeviceConfig ||
          conf instanceof AdapterDeviceConfig
        ) {
          const configs = inputIds.map((i) => conf.getInputById(i)!.config);
          MainWindow.sendInputConfigs(configs);
        }
      }
    );
  }

  public title() {
    return TranslatorPlugin.TITLE();
  }

  public description() {
    return TranslatorPlugin.DESCRIPTION();
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
