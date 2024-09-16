import { MidiArray } from '../midi-array';

import { DeviceDriver } from '../driver-types';

import { DeviceConfig, DeviceConfigDTO } from './device-config';
import { create } from './input-config';
import { BaseInputConfig, InputDTO } from './input-config/base-input-config';

interface SupportedDeviceConfigDTO extends DeviceConfigDTO {
  inputs: InputDTO[];
  className: 'SupportedDeviceConfig';
}

/* Contains device-specific configurations and managed `InputConfig`s */
export class SupportedDeviceConfig extends DeviceConfig<SupportedDeviceConfigDTO> {
  public inputs: BaseInputConfig[];

  public static fromDriver(
    portName: string,
    siblingIndex: number,
    driver: DeviceDriver
  ) {
    const inputs: BaseInputConfig[] = [];
    driver.inputGrids.forEach((ig) => {
      ig.inputs.forEach((d) => {
        if (d.interactive) {
          inputs.push(create(d));
        }
      });
    });

    const newConfig = new SupportedDeviceConfig(
      portName,
      driver.name,
      siblingIndex,
      inputs,
      undefined
    );

    return newConfig;
  }

  constructor(
    name: string,
    driverName: string,
    siblingIndex: number,
    inputs: BaseInputConfig[],
    nickname?: string
  ) {
    super(name, driverName, siblingIndex, nickname);
    this.inputs = inputs;
  }

  public toDTO() {
    return {
      ...this.stub(),
      className: 'SupportedDeviceConfig' as const,
      inputs: this.inputs.map((i) => i.toDTO()),
    };
  }

  /**
   * Are the statusString, number, and channel currently in use? Returns true if an input
   * uses all three params. Useful for avoiding inputs sending the same events
   *
   * TODO:
   */
  // bindingAvailable(
  //   statusString: StatusString | 'noteon/noteoff',
  //   number: number,
  //   channel: Channel
  // ) {
  //   let available = true;

  //   this.inputs.forEach((input) => {
  //     if (
  //       input instanceof MonoInputConfig &&
  //       input.statusString === statusString &&
  //       input.number === number &&
  //       input.channel === channel
  //     ) {
  //       available = false;
  //     }
  //   });
  //   return available;
  // }

  /**
   * Returns the `BaseInputConfig` for given id
   */
  public getInputById(id: string) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.id === id) return input;
    }
    return undefined;
  }

  /**
   * Returns the `BaseInputConfig` which is the originator of `msg`. E.g. a CC pad
   * input with number 32 and channel 2 is the originator of the message [178, 32, 127]
   * but not [144, 32, 127] nor [178, 31, 127]
   */
  public getOriginatorInput(msg: MidiArray | NumberArrayWithStatus) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.isOriginator(msg)) return input;
    }
    return undefined;
  }

  public applyOverrides(msg: MidiArray) {
    const input = this.getOriginatorInput(msg);
    return input !== undefined ? input.handleMessage(msg) : msg;
  }

  public getResponse(msg: MidiArray) {
    // TODO:
    return msg;
  }
}
