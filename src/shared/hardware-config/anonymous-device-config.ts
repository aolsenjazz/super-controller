import { DeviceConfig } from './device-config';

export class AnonymousDeviceConfig extends DeviceConfig {
  readonly overrides: Map<string, number[]>;

  /* eslint-disable-next-line */
  static fromParsedJSON(obj: any) {
    const overrides = new Map<string, number[]>(obj.overrides);

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
    overrides: Map<string, number[]>,
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
  handleMessage(msg: number[]) {
    const id = JSON.stringify(msg);
    const override = this.overrides.get(id);

    return [null, override || msg];
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      siblingIndex: this.siblingIndex,
      supported: this.supported,
      nickname: this.nickname,
      shareSustain: this.shareSustain,
      overrides: Array.from(this.overrides.entries()),
    });
  }
}
