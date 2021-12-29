import { MidiValue, MidiMessage } from 'midi-message-parser';

import { DeviceConfig } from './device-config';
import { inputIdFor } from '../device-util';

export class AnonymousDeviceConfig implements DeviceConfig {
  readonly supported = false;

  readonly id: string;

  readonly name: string;

  readonly occurrenceNumber: number;

  readonly overrides: Map<string, MidiValue[]>;

  readonly keyboardDriver = undefined;

  readonly shareSustain = [];

  /* User-defined nickname */
  #nickname?: string;

  /* eslint-disable-next-line */
  static fromParsedJSON(obj: any) {
    const overrides = new Map<string, MidiValue[]>(obj.overrides);

    return new AnonymousDeviceConfig(
      obj.id,
      obj.name,
      obj.occurrenceNumber,
      overrides,
      obj.nickname
    );
  }

  constructor(
    id: string,
    name: string,
    occurrenceNumber: number,
    overrides: Map<string, MidiValue[]>,
    nickname?: string
  ) {
    this.id = id;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;
    this.overrides = overrides;
    this.#nickname = nickname;
  }

  /**
   * Tries to apply overrides. If no matching overrides available,
   * send a propagates the message and sends nothing to device.
   *
   * @param { MidiValue[] } message The MidiValue[] from device
   * @return { (MidiValue[] | null)[] } [messageToDevice | null, messageToPropagate]
   */
  handleMessage(msg: MidiValue[] | null) {
    if (msg === null) return [null, null];

    const mm = new MidiMessage(msg, 0);
    const override = this.overrides.get(
      inputIdFor(mm.number, mm.channel, mm.type)
    );

    if (!override) return [null, msg];

    return [null, override];
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      occurrenceNumber: this.occurrenceNumber,
      nickname: this.nickname,
      overrides: Array.from(this.overrides.entries()),
    });
  }

  get nickname() {
    return this.#nickname !== undefined ? this.#nickname : this.name;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }
}
