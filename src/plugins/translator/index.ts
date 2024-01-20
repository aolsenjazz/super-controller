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

const { MainWindow } = wp;

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-empty-interface
interface TranslatorIcicle extends PluginIcicle {}

export class TranslatorPlugin extends BasePlugin<TranslatorIcicle> {
  public process(msg: MidiArray | NumberArrayWithStatus) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }

  public freeze() {
    return {
      id: this.id,
      title: this.title(),
    };
  }

  protected initIpcListeners(): void {
    ipcMain.on(
      CONFIG.UPDATE_INPUT,
      (_e: IpcMainEvent, deviceId: string, configs: InputConfigStub[]) => {
        const { project } = ProjectProvider;
        const deviceConfig = project.getDevice(
          deviceId
        ) as SupportedDeviceConfig;

        const updatedConfigs: BaseInputConfig[] = [];
        configs.forEach((c) => {
          const id = idForConfigStub(c);
          const input = deviceConfig.getInputById(id);

          if (input) {
            input.applyStub(c);
            updatedConfigs.push(input);
            MainWindow.sendInputState(deviceId, id, input.state);
          }
        });

        MainWindow.edited = true;
        MainWindow.sendInputConfigs(updatedConfigs.map((c) => c.config));
        // this.emit(
        //   ProjectProviderEvent.UpdateInput,
        //   deviceConfig,
        //   updatedConfigs
        // );
      }
    );

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
    return 'Translator';
  }

  public description() {
    return 'Temp Description';
  }

  public get applicableDeviceTypes(): (
    | 'supported'
    | 'anonymous'
    | 'adapter'
  )[] {
    return ['anonymous'];
  }
}
