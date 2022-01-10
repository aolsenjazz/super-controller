import { MidiValue, MidiMessage } from 'midi-message-parser';

import { DeviceConfig } from './device-config';
import { inputIdFor } from '../device-util';

export class AnonymousDeviceConfig extends DeviceConfig {
  readonly overrides: Map<string, MidiValue[]>;

  /* eslint-disable-next-line */
  static fromParsedJSON(obj: any) {
    const overrides = new Map<string, MidiValue[]>(obj.overrides);

    return new AnonymousDeviceConfig(
      obj.name,
      obj.siblingIndex,
      overrides,
      obj.shareSustain,
      obj.nickname
    );
  }

  constructor(
    name: string,
    siblingIndex: number,
    overrides: Map<string, MidiValue[]>,
    shareSustain: string[],
    nickname?: string
  ) {
    super(name, siblingIndex, false, shareSustain, nickname);

    this.overrides = overrides;
  }

  /**
   * Tries to apply overrides. If no matching overrides available,
   * send a propagates the message and sends nothing to device.
   *
   * @param message The MidiValue[] from device
   * @returns [messageToDevice | null, messageToPropagate]
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
      name: this.name,
      siblingIndex: this.siblingIndex,
      nickname: this.nickname,
      overrides: Array.from(this.overrides.entries()),
    });
  }
}
