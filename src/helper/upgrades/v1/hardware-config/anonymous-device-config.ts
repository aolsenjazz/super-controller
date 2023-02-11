import { Channel, StatusString, setStatus } from '../midi-util';
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
   * propagates the message and sends nothing to device.
   *
   * @param message The MidiValue[] from device
   * @returns [messageToDevice | null, messageToPropagate]
   */
  handleMessage(msg: number[]) {
    const valueNegatedMsg = [...msg];
    valueNegatedMsg[2] = 0;
    const id = JSON.stringify(valueNegatedMsg);
    const override = this.overrides.get(id);

    if (override) {
      // eslint-disable-next-line
      override[2] = msg[2];
      return [null, override];
    }

    return [null, msg];
  }

  /**
   * Set the override message to be propagated from SuperController when the given input is received.
   * Value-independent; values are propagated normally and cannot be overriden
   */
  overrideInput(
    targetInput: number[],
    newStatus: StatusString,
    newChannel: Channel,
    newNumber: number
  ) {
    const valueNegatedTarget = [...targetInput];
    valueNegatedTarget[2] = 0;
    const override = setStatus([newChannel, newNumber, 0], newStatus);
    this.overrides.set(JSON.stringify(valueNegatedTarget), override);
  }

  /**
   * Returns a midi tuplet with whatever overriden values have been set for the given message.
   * *NOTE* that the value in the returned MIDI tuplet will be 0 because overrides are set
   * independently of value
   */
  getOverride(input: number[]) {
    const valueNegatedMsg = [...input];
    valueNegatedMsg[2] = 0;
    return this.overrides.get(JSON.stringify(valueNegatedMsg));
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
