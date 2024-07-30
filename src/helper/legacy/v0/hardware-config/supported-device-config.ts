import { StatusString, Channel } from '../midi-util';
import { inputIdFor } from '../util';
import { DeviceDriver, KeyboardDriver } from '../driver-types';

import { DeviceConfig } from './device-config';
import { InputConfig } from './input-config';

/* Contains device-specific configurations and managed `InputConfig`s */
export class SupportedDeviceConfig extends DeviceConfig {
  /* See `InputConfig` */
  inputs: InputConfig[];

  /* See `KeyboardDriver` */
  keyboardDriver?: KeyboardDriver;

  /**
   * Constructs a new instance of SupportedDeviceConfig from DeviceDriver.
   *
   * @param siblingIndex The nth-occurrence of this device. Relevant when >1 device of same model is connected
   * @param driver The driver
   * @returns a new instance of SupportedDeviceConfig
   */
  static fromDriver(siblingIndex: number, driver: DeviceDriver) {
    const inputs = driver.inputGrids
      .map((grid) => grid.inputs)
      .flat()
      .flat()
      .map((d) => InputConfig.fromDriver(d));

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

  /**
   * Constructs a new instance of SupportedDeviceConfig from a json string.
   *
   * @param parsed JSON.parse()'d string
   * @returns A new instance of SupportedDeviceConfig
   */
  /* eslint-disable-next-line */
  static fromParsedJSON(parsed: any) {
    const inputs = parsed.inputs.map((inputJSON: string) =>
      InputConfig.fromJSON(inputJSON)
    );

    const newDevice = new SupportedDeviceConfig(
      parsed.name,
      parsed.siblingIndex,
      parsed.shareSustain,
      inputs,
      parsed.nickname,
      parsed.keyboardDriver
    );

    return newDevice;
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

  /**
   * Are the eventType, number, and channel currently in use? Returns true if an input
   * uses all three params. Useful for avoiding inputs sending the same events
   *
   * @param eventType The MIDI event type (probably 'controlchange')
   * @param number The MIDI number
   * @param channel The MIDI channel
   * @returns Is this binding available?
   */
  bindingAvailable(
    eventType: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel
  ) {
    let available = true;

    this.inputs.forEach((input) => {
      if (
        input.eventType === eventType &&
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
   * Serializes this device config and all child configs. Useful in tandem
   * with SupportedDeviceConfig.fromParsedJSON()
   *
   * @param includeState Should we include state information?
   * @returns JSON string
   */
  toJSON(includeState: boolean) {
    const obj = {
      id: this.id,
      name: this.name,
      siblingIndex: this.siblingIndex,
      nickname: this.nickname,
      supported: this.supported,
      shareSustain: this.shareSustain,
      keyboardDriver: this.keyboardDriver,
      inputs: this.inputs.map((input) => input.toJSON(includeState)),
    };

    return JSON.stringify(obj);
  }

  /**
   * Tries to pass the message to an `InputConfig`. If no matching `InputConfig`s,
   * send a propagates the message and sends nothing to device.
   *
   * @param message The MidiValue[] from device
   * @returns [messageToDevice | null, messageToPropagate]
   */
  handleMessage(msg: number[]): (number[] | undefined)[] {
    const id = inputIdFor(msg);
    const input = this.getInput(id);

    return input !== undefined ? input.handleMessage(msg) : [undefined, msg];
  }
}
