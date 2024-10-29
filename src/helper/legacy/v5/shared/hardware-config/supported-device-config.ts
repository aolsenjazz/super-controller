import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';

import { DeviceDriver, KeyboardDriver } from '../driver-types';

import { DeviceConfig } from './device-config';
import {
  MonoInputConfig,
  create,
  LightCapableInputConfig,
} from './input-config';
import { BaseInputConfig } from './input-config/base-input-config';

/* Contains device-specific configurations and managed `InputConfig`s */
@Revivable.register
export class SupportedDeviceConfig extends DeviceConfig {
  /* See `InputConfig` */
  inputs: BaseInputConfig[];

  /* See `KeyboardDriver` */
  keyboardDriver?: KeyboardDriver;

  isAdapter = false;

  static fromDriver(
    portName: string,
    siblingIndex: number,
    driver: DeviceDriver,
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
      [],
      inputs,
      undefined,
      driver.keyboard,
    );

    return newConfig;
  }

  constructor(
    name: string,
    driverName: string,
    siblingIndex: number,
    shareSustain: string[],
    inputs: BaseInputConfig[],
    nickname?: string,
    keyboardDriver?: KeyboardDriver,
  ) {
    super(name, driverName, siblingIndex, shareSustain, nickname);
    this.inputs = inputs;
    this.keyboardDriver = keyboardDriver;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): { name: string; args: any[] } {
    return {
      name: this.constructor.name,
      args: [
        this.portName,
        this.driverName,
        this.siblingIndex,
        this.shareSustain,
        this.inputs,
        this.nickname,
        this.keyboardDriver,
      ],
    };
  }

  /**
   * Are the statusString, number, and channel currently in use? Returns true if an input
   * uses all three params. Useful for avoiding inputs sending the same events
   */
  bindingAvailable(
    statusString: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel,
  ) {
    let available = true;

    this.inputs.forEach((input) => {
      if (
        input instanceof MonoInputConfig &&
        input.statusString === statusString &&
        input.number === number &&
        input.channel === channel
      ) {
        available = false;
      }
    });
    return available;
  }

  /**
   * Returns the `BaseInputConfig` for given id
   */
  getInputById(id: string) {
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
  getOriginatorInput(msg: MidiArray | NumberArrayWithStatus) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.isOriginator(msg)) return input;
    }
    return undefined;
  }

  applyOverrides(msg: MidiArray) {
    const input = this.getOriginatorInput(msg);
    return input !== undefined ? input.handleMessage(msg) : msg;
  }

  getResponse(msg: MidiArray) {
    const input = this.getOriginatorInput(msg);

    return input instanceof LightCapableInputConfig
      ? input.currentColorArray
      : undefined;
  }

  get stub() {
    return {
      id: this.id,
      portName: this.portName,
      driverName: this.driverName,
      nickname: this.nickname,
      siblingIndex: this.siblingIndex,
      isAdapter: false,
      isAnonymous: false,
      shareSustain: this.shareSustain,
    };
  }
}
