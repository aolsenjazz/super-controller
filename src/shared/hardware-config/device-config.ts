import { MidiArray } from '../midi-array';
import { KeyboardDriver } from '../driver-types';

export type ConfigDescriptor = {
  isAdapter: boolean;
  isSupported: boolean;
  isAnonymous: boolean;
  isAdapterChildSet: boolean;
  nickname: string;
  shareSustain: string[];
};

/**
 * Base interface for SupportedDeviceConfig and AnonymousDeviceConfig.
 */
export abstract class DeviceConfig {
  /**
   * MIDI-driver-reported name. E.g. for Launchkey Mini MK3:
   *
   * OSX: Launchkey Mini MK3 MIDI
   * Linux: Launchkey Mini MK3:Launchkey Mini MK3 Launchkey Mi 20:0
   *
   * Used to bind this config to the given port.
   *
   */
  readonly portName: string;

  /**
   * Name of the driver to bind this config to. E.g. APC Key 25 | iRig BlueBoard. The value
   * of this field should match the name field of one of the driver files in src/shared/drivers
   */
  readonly driverName: string;

  /**
   * True if a driver exists for the given name. Right now, this only applies to OSX;
   * driver names vary per-OS, and likely per-OS-MIDI-driver.
   *
   * TODO: now that we're allowing lazily-selecting the driver to use on linux,
   * this description is either inaccurate or `supported` is a flawed concept
   */
  readonly supported: boolean;

  /* nth-occurence of this device. applicable if > 1 device of same model is connected/configured */
  readonly siblingIndex: number;

  abstract readonly isAdapter: boolean;

  /**
   * List of devices with which sustain events are shared.
   *
   * Sharing a sustain event means that whenever a sustain message is received
   * on this device, a sustain event will also be sent to clients from the shared
   * devices, on the same channel as their respective keyboards.
   */
  shareSustain: string[];

  /* User-defined nickname */
  #nickname?: string;

  keyboardDriver?: KeyboardDriver;

  constructor(
    portName: string,
    driverName: string,
    siblingIndex: number,
    supported: boolean,
    shareSustain: string[],
    nickname?: string
  ) {
    this.portName = portName;
    this.driverName = driverName;
    this.siblingIndex = siblingIndex;
    this.supported = supported;
    this.shareSustain = shareSustain;
    this.#nickname = nickname;
  }

  get nickname() {
    return this.#nickname !== undefined ? this.#nickname : this.portName;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }

  get id() {
    return `${this.portName} ${this.siblingIndex}`;
  }

  /**
   * Is this device currently sharing sustain events with the given device?
   *
   * @param id The id of the other device
   * @returns You know
   */
  sharingWith(id: string) {
    return this.shareSustain.includes(id);
  }

  /**
   * Shares sustain events with the given device
   *
   * @param id The id of the other device
   */
  shareWith(id: string) {
    this.shareSustain.push(id);
  }

  /**
   * Stops sharing sustain events with the given device
   *
   * @param id The id of the other device
   */
  stopSharing(id: string) {
    const idx = this.shareSustain.indexOf(id);
    this.shareSustain.splice(idx, 1);
  }

  abstract get descriptor(): ConfigDescriptor;
  abstract applyOverrides(msg: MidiArray): MidiArray | undefined;
  abstract getResponse(msg: MidiArray): MidiArray | undefined;
}
