import { KeyboardDriver } from '../driver-types';
import { PortIdentifier } from '../port-info';

/**
 * Base interface for SupportedDeviceConfig and AnonymousDeviceConfig.
 */
export class DeviceConfig implements PortIdentifier {
  /* True if a driver exists for the given name */
  readonly supported: boolean;

  /* Device-reported name */
  readonly name: string;

  /* nth-occurence of this device. applicable if > 1 device of same model is connected/configured */
  readonly siblingIndex: number;

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
    name: string,
    siblingIndex: number,
    supported: boolean,
    shareSustain: string[],
    nickname?: string
  ) {
    this.name = name;
    this.siblingIndex = siblingIndex;
    this.supported = supported;
    this.shareSustain = shareSustain;
    this.#nickname = nickname;
  }

  get nickname() {
    return this.#nickname !== undefined ? this.#nickname : this.name;
  }

  set nickname(nickname: string) {
    this.#nickname = nickname;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
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
}
