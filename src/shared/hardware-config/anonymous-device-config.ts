import { MidiArray } from '../midi-array';
import { DeviceConfig } from './device-config';

export class AnonymousDeviceConfig extends DeviceConfig {
  // TODO: This likely should be made private - accessing this from outside of this class is smelly
  readonly overrides: Map<string, MidiArray>;

  isAdapter = false;

  /* eslint-disable-next-line */
  static fromParsedJSON(obj: any) {
    const tupleOverrides = new Map<string, MidiTuple>(obj.overrides);
    const msgOverrides = new Map<string, MidiArray>();
    Array.from(tupleOverrides.keys()).forEach((k) => {
      const msg = new MidiArray(tupleOverrides.get(k)!);
      msgOverrides.set(k, msg);
    });

    return new AnonymousDeviceConfig(
      obj.name,
      obj.siblingIndex,
      msgOverrides,
      obj.shareSustain,
      obj.nickname
    );
  }

  constructor(
    name: string,
    siblingIndex: number,
    overrides: Map<string, MidiArray>,
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
  handleMessage(msg: MidiArray) {
    const valueNegatedMsg = new MidiArray(msg.array);

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
   * TODO: Rename this method. It's a misnomer to say that we're overriding an input because
   * it's not always a one-to-one relationship between inputs and overrides
   *
   * Set the override message to be propagated from SuperController when the given input is received.
   * Value-independent; values are propagated normally and cannot be overriden
   */
  overrideInput(
    targetInput: MidiArray,
    newStatus: StatusString | StatusByte,
    newChannel: Channel,
    newNumber: MidiNumber
  ) {
    const valueNegatedTarget = [...targetInput];
    valueNegatedTarget[2] = 0;
    const override = MidiArray.create(newStatus, newChannel, newNumber, 0);
    this.overrides.set(JSON.stringify(valueNegatedTarget), override);
  }

  /**
   * TODO: Maybe it would be beneficial to give this input notion a proper name - something like "signal"
   * i.e. overrides are applied to signals. cause it's not necesaarily that it's a one-to-one relation
   * between inputs and overrides
   *
   * Returns a midi tuplet with whatever overriden values have been set for the given message.
   * *NOTE* that the value in the returned MIDI tuplet will be 0 because overrides are set
   * independently of value
   */
  getOverride(input: MidiArray) {
    const valueNegatedMsg = [...input];
    valueNegatedMsg[2] = 0;
    return this.overrides.get(JSON.stringify(valueNegatedMsg));
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      siblingIndex: this.siblingIndex,
      supported: false,
      nickname: this.nickname,
      shareSustain: this.shareSustain,
      overrides: Array.from(this.overrides.entries()),
    });
  }
}
