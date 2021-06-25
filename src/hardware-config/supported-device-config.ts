import { MidiMessage, MidiValue, Channel } from 'midi-message-parser';

import { inputIdFor } from '../device-util';
import { DeviceDriver } from '../driver-types';

import { KeyboardConfig } from './keyboard-config';
import { DeviceConfig } from './device-config';
import { InputConfig } from './input-config';

/* Contains device-specific configurations and managed `InputConfig`s */
export class SupportedDeviceConfig implements DeviceConfig {
  /* Does the device have a driver? */
  readonly supported = true;

  /* The device-reported name */
  readonly name: string;

  /* `${name} ${occurrenceNumber}` */
  id: string;

  /**
   * List of devices with which sustain events are shared.
   *
   * Sharing a sustain event means that whenever a sustain message is received
   * on this device, a sustain event will also be sent to clients from the shared
   * devices, on the same channel as their respective keyboards.
   */
  shareSustain: string[];

  /* See `InputConfig` */
  inputs: InputConfig[];

  /* The nth-occurence of this device. Only relevant when >1 device of same model is connected */
  #occurrenceNumber: number;

  /* User-defined nickname */
  #nickname?: string;

  /* See `KeyboardConfig` */
  keyboardConfig?: KeyboardConfig;

  /**
   * Constructs a new instance of SupportedDeviceConfig from DeviceDriver.
   *
   * @param { string } id The id of the device's port
   * @param { number } occurrencenumber The nth-occurence of this device. Relevant when >1 device of same model is connected
   * @param { DeviceDriver } driver The driver
   * @return { SupportedDeviceConfig } a new instance of SupportedDeviceConfig
   */
  static fromDriver(
    id: string,
    occurrenceNumber: number,
    driver: DeviceDriver
  ) {
    const inputs = driver.inputGrids
      .map((grid) => grid.inputs)
      .flat()
      .flat()
      .map((d) => InputConfig.fromDriver(d));

    const newConfig = new SupportedDeviceConfig(
      id,
      driver.name,
      occurrenceNumber,
      [],
      inputs,
      undefined,
      KeyboardConfig.fromDriver(driver.keyboard)
    );

    return newConfig;
  }

  /**
   * Constructs a new instance of SupportedDeviceConfig from a json string.
   *
   * @param { string } json JSON string
   * @return { SupportedDeviceConfig } A new instance of SupportedDeviceConfig
   */
  static fromJSON(json: string) {
    const parsed = JSON.parse(json);
    const inputs = parsed.inputs.map((inputJSON: string) =>
      InputConfig.fromJSON(inputJSON)
    );

    const newDevice = new SupportedDeviceConfig(
      parsed.id,
      parsed.name,
      parsed.occurrenceNumber,
      parsed.shareSustain,
      inputs,
      parsed.nickname,
      KeyboardConfig.fromParsedJSON(parsed.keyboardConfig)
    );

    return newDevice;
  }

  constructor(
    id: string,
    name: string,
    occurrenceNumber: number,
    shareSustain: string[],
    inputs: InputConfig[],
    nickname?: string,
    keyboardConfig?: KeyboardConfig
  ) {
    this.id = id;
    this.name = name;
    this.#occurrenceNumber = occurrenceNumber;
    this.shareSustain = shareSustain;
    this.inputs = inputs;
    this.#nickname = nickname;
    this.keyboardConfig = keyboardConfig;
  }

  /**
   * Are the eventType, number, and channel currently in use? Returns true if an input
   * uses all three params. Useful for avoiding inputs sending the same events
   *
   * @param { string | null } eventType The MIDI event type (probably 'controlchange')
   * @param { MidiValue | null | string } number The MIDI number
   * @param { Channel | null | string } channel The MIDI channel
   * @return { boolean } Is this binding available?
   */
  bindingAvailable(
    eventType: string | null,
    number: MidiValue | null | string,
    channel: Channel | null | string
  ) {
    return (
      this.inputs.filter(
        (input) =>
          input.eventType === eventType &&
          input.number === number &&
          input.channel === channel
      ).length === 0
    );
  }

  /**
   * Is this device currently sharing sustain events with the given device?
   *
   * @param { string } id The id of the other device
   * @return { boolean } You know
   */
  sharingWith(id: string) {
    return this.shareSustain.includes(id);
  }

  /**
   * Shares sustain events with the given device
   *
   * @param { string } id The id of the other device
   */
  shareWith(id: string) {
    this.shareSustain.push(id);
  }

  /**
   * Stops sharing sustain events with the given device
   *
   * @param { string } id The id of the other device
   */
  stopSharing(id: string) {
    const idx = this.shareSustain.indexOf(id);
    this.shareSustain.splice(idx, 1);
  }

  /**
   * Get an input by id
   *
   * @param { string } id The ID of the requested input
   * @return { InputConfig | undefined }
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
   * with SupportedDeviceConfig.fromJSON()
   *
   * @param { boolean } includeState Should we include state information?
   * @return { string } JSON string
   */
  toJSON(includeState: boolean) {
    const obj = {
      supported: this.supported,
      occurrenceNumber: this.occurrenceNumber,
      id: this.id,
      name: this.name,
      shareSustain: this.shareSustain,
      nickname: this.nickname,
      inputs: this.inputs.map((input) => input.toJSON(includeState)),
      keyboardConfig: this.keyboardConfig,
    };

    return JSON.stringify(obj);
  }

  /**
   * Passes the message to an `InputConfig` for overrides, or does nothing if
   * no matching `InputConfig`
   *
   * @param { MidiValue[] } message The MidiValue[] from device
   * @return { (MidiValue[] | null)[] } [messageToDevice | null, messageToPropagate]
   */
  handleMessage(message: MidiValue[]): (MidiValue[] | null)[] {
    if (this.#isKeyboardMsg(message)) return this.#handleKeyboardMsg(message);

    const mm = new MidiMessage(message, 0);
    const id = inputIdFor(mm.number, mm.channel, mm.type);

    const input = this.getInput(id);

    if (input !== undefined) {
      return input.handleMessage(message);
    }

    return [null, message]; // if no input config, just propagate the message
  }

  /**
   * Handle a message from the keyboard. Just propagate to clients.
   *
   * @param { MidiValue[] } msg The MidiValue[] from device
   * @return { [null, MidiValue[]] }
   */
  #handleKeyboardMsg = (msg: MidiValue[]) => {
    return [null, msg];
  };

  /**
   * Is this a message from the keyboard? *NOTE: this is not conclusive!!* Many midi
   * controllers have pads that send noteon/noteoff events on the same channel as its
   * keyboard, and as a result, are virtually indistinguishable from keyboard events :(
   *
   * @param { MidiValue[] } msg The message from the device
   * @return { boolean } you know
   */
  #isKeyboardMsg = (msg: MidiValue[]) => {
    const mm = new MidiMessage(msg, 0);
    return (
      mm.channel === this.keyboardConfig?.channel &&
      ['noteoff', 'noteon'].includes(mm.type)
    );
  };

  get nickname() {
    return this.#nickname !== undefined ? this.#nickname : this.name;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }

  get occurrenceNumber() {
    return this.#occurrenceNumber;
  }

  set occurrenceNumber(occurrenceNumber: number) {
    this.#occurrenceNumber = occurrenceNumber;
    this.id = `${this.name} ${occurrenceNumber}`;
  }
}
