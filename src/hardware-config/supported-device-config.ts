import { MidiMessage, MidiValue, Channel } from 'midi-message-parser';

import { inputIdFor } from '../device-util';
import { DeviceDriver, KeyboardDriver } from '../driver-types';

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

  /* See `KeyboardDriver` */
  keyboardDriver?: KeyboardDriver;

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
      driver.keyboard
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
      parsed.keyboardDriver
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
    keyboardDriver?: KeyboardDriver
  ) {
    this.id = id;
    this.name = name;
    this.#occurrenceNumber = occurrenceNumber;
    this.shareSustain = shareSustain;
    this.inputs = inputs;
    this.#nickname = nickname;
    this.keyboardDriver = keyboardDriver;
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
      keyboardDriver: this.keyboardDriver,
    };

    return JSON.stringify(obj);
  }

  /**
   * Tries to pass the message to an `InputConfig`. If no matching `InputConfig`s,
   * send a propagates the message and sends nothing to device.
   *
   * @param { MidiValue[] } message The MidiValue[] from device
   * @return { (MidiValue[] | null)[] } [messageToDevice | null, messageToPropagate]
   */
  handleMessage(message: MidiValue[]): (MidiValue[] | null)[] {
    const mm = new MidiMessage(message, 0);
    const id = inputIdFor(mm.number, mm.channel, mm.type);

    const input = this.getInput(id);

    if (input !== undefined) return input.handleMessage(message);

    return [null, message]; // if no input config, just propagate the message
  }

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
