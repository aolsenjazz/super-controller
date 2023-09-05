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

  /**
   * Constructs a new instance of SupportedDeviceConfig from DeviceDriver.
   *
   * @param siblingIndex The nth-occurrence of this device. Relevant when >1 device of same model is connected
   * @param driver The driver
   * @returns a new instance of SupportedDeviceConfig
   */
  static fromDriver(
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
      [],
      inputs,
      undefined,
      driver.keyboard
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
    keyboardDriver?: KeyboardDriver
  ) {
    super(name, driverName, siblingIndex, true, shareSustain, nickname);
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
   *
   * @param statusString The MIDI event type (probably 'controlchange')
   * @param number The MIDI number
   * @param channel The MIDI channel
   * @returns Is this binding available?
   */
  bindingAvailable(
    statusString: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel
  ) {
    let available = true;

    this.inputs.forEach((input) => {
      // TODO: there's probably a more elegant way to do this
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
   * Get an input by id
   *
   * @param id The ID of the requested input
   * @returns
   */
  getInput(id: string) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.id === id) return input;
    }

    return undefined;
  }

  applyOverrides(msg: MidiArray) {
    const input = this.getInput(msg.id(true));
    return input !== undefined ? input.handleMessage(msg) : msg;
  }

  getResponse(msg: MidiArray) {
    const input = this.getInput(msg.id(true));

    return input instanceof LightCapableInputConfig
      ? input.currentColorArray
      : undefined;
  }
}
