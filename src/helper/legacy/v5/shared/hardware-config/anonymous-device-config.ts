import * as Revivable from '../revivable';
import { MidiArray, create } from '../midi-array';
import { DeviceConfig } from './device-config';

export interface ImmutableMidiArrayMap {
  get(key: string): MidiArray | undefined;
}

@Revivable.register
export class AnonymousDeviceConfig extends DeviceConfig {
  #overrides: Map<string, MidiArray>;

  isAdapter = false;

  constructor(
    portName: string,
    siblingIndex: number,
    overrides: Map<string, MidiArray>,
    shareSustain: string[],
    nickname?: string,
  ) {
    super(portName, 'Anonymous', siblingIndex, shareSustain, nickname);

    this.#overrides = overrides;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [
        this.portName,
        this.siblingIndex,
        this.#overrides,
        this.shareSustain,
        this.nickname,
      ],
    };
  }

  applyOverrides(mArray: MidiArray) {
    const msg = create(mArray);
    const id = JSON.stringify(msg);
    const override = this.#overrides.get(id);

    return override === undefined ? mArray : override;
  }

  getResponse() {
    return undefined;
  }

  /**
   * Set the override message to be propagated from SuperController when the given input is received.
   * Value-independent; values are propagated normally and cannot be overriden
   */
  overrideInput(
    targetInput: MidiArray,
    newStatus: StatusString | StatusByte,
    newChannel: Channel,
    newNumber: MidiNumber,
    newValue: MidiNumber,
  ) {
    const override = create(newStatus, newChannel, newNumber, newValue);
    this.#overrides.set(JSON.stringify(targetInput), override);
  }

  /**
   * Returns a midi tuplet with whatever overriden values have been set for the given message.
   */
  getOverride(input: MidiArray) {
    return this.#overrides.get(JSON.stringify(input));
  }

  deleteOverride(action: NumberArrayWithStatus) {
    this.#overrides.delete(JSON.stringify(action));
  }

  get overrides() {
    return this.#overrides;
  }

  get stub() {
    return {
      id: this.id,
      portName: this.portName,
      driverName: this.driverName,
      nickname: this.nickname,
      siblingIndex: this.siblingIndex,
      isAdapter: false,
      isAnonymous: true,
      shareSustain: this.shareSustain,
    };
  }
}
