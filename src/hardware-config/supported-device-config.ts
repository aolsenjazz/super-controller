import { MidiMessage, MidiValue, Channel } from 'midi-message-parser';

import { inputIdFor } from '../device-util';
import { DeviceDriver } from '../driver-types';

import { KeyboardConfig } from './keyboard-config';
import { DeviceConfig } from './device-config';
import { InputConfig } from './input-config';

export class SupportedDeviceConfig implements DeviceConfig {
  readonly supported = true;

  readonly name: string;

  #occurrenceNumber: number;

  id: string;

  shareSustain: string[];

  #nickname?: string;

  keyboardConfig?: KeyboardConfig;

  inputs: InputConfig[];

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

  #handleKeyboardMsg = (msg: MidiValue[]) => {
    return [null, msg];
  };

  #isKeyboardMsg = (msg: MidiValue[]) => {
    const mm = new MidiMessage(msg, 0);
    return (
      mm.channel === this.keyboardConfig?.channel &&
      ['noteoff', 'noteon'].includes(mm.type)
    );
  };

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

  sharingWith(id: string) {
    return this.shareSustain.includes(id);
  }

  shareWith(id: string) {
    this.shareSustain.push(id);
  }

  stopSharing(id: string) {
    const idx = this.shareSustain.indexOf(id);
    this.shareSustain.splice(idx, 1);
  }

  equals(other: SupportedDeviceConfig) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      const otherInput = other.getInput(input.id);

      if (!otherInput || !input.equals(otherInput)) return false;
    }

    return (
      JSON.stringify(this.shareSustain) ===
        JSON.stringify(other.shareSustain) &&
      this.occurrenceNumber === other.occurrenceNumber &&
      this.id === other.id &&
      this.inputs.length === other.inputs.length &&
      this.name === other.name
    );
  }

  getInput(id: string) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.id === id) return input;
    }

    return undefined;
  }

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
