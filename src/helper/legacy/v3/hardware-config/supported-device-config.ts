import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';

import { DeviceDriver, KeyboardDriver } from '../driver-types';

import { DeviceConfig } from './device-config';
import { InputConfig } from './input-config';

/* Contains device-specific configurations and managed `InputConfig`s */
@Revivable.register
export class SupportedDeviceConfig extends DeviceConfig {
  /* See `InputConfig` */
  inputs: InputConfig[];

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
  static fromDriver(siblingIndex: number, driver: DeviceDriver) {
    const inputs: InputConfig[] = [];
    driver.inputGrids.forEach((ig) => {
      ig.inputs.forEach((d) => {
        if (d.interactive) {
          inputs.push(InputConfig.fromDriver(d));
        }
      });
    });

    const newConfig = new SupportedDeviceConfig(
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
    siblingIndex: number,
    shareSustain: string[],
    inputs: InputConfig[],
    nickname?: string,
    keyboardDriver?: KeyboardDriver
  ) {
    super(name, siblingIndex, true, shareSustain, nickname);
    this.inputs = inputs;
    this.keyboardDriver = keyboardDriver;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJSON(): { name: string; args: any[] } {
    return {
      name: this.constructor.name,
      args: [
        this.name,
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
      if (
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

  /**
   * Tries to pass the message to an `InputConfig`. If no matching `InputConfig`s,
   * send a propagates the message and sends nothing to device.
   *
   * @param message The MidiValue[] from device
   * @returns [messageToDevice | null, messageToPropagate]
   */
  handleMessage(msg: MidiArray): (MidiArray | undefined)[] {
    const input = this.getInput(msg.id(true));
    return input !== undefined ? input.handleMessage(msg) : [undefined, msg];
  }
}
