import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { SupportedDeviceConfig } from './supported-device-config';

@Revivable.register
export class AdapterDeviceConfig implements SupportedDeviceConfig {
  isAdapter = true;

  name: string;

  supported = true;

  siblingIndex: number;

  child?: SupportedDeviceConfig;

  constructor(
    name: string,
    siblingIndex: number,
    child?: SupportedDeviceConfig,
  ) {
    this.name = name;
    this.siblingIndex = siblingIndex;
    this.child = child;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.name, this.siblingIndex, this.child],
    };
  }

  setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  get isSet() {
    return this.child !== undefined;
  }

  bindingAvailable(
    eventType: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel,
  ) {
    return this.child!.bindingAvailable(eventType, number, channel);
  }

  handleMessage(msg: MidiArray): (MidiArray | undefined)[] {
    return this.child!.handleMessage(msg);
  }

  get inputs() {
    return this.child!.inputs;
  }

  get shareSustain() {
    return this.child!.shareSustain;
  }

  get nickname() {
    return this.child!.nickname;
  }

  set nickname(nickname: string) {
    this.child!.nickname = nickname;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
  }

  shareWith(id: string) {
    return this.child!.shareWith(id);
  }

  stopSharing(id: string) {
    return this.child!.stopSharing(id);
  }

  sharingWith(id: string) {
    return this.child!.sharingWith(id);
  }

  /**
   * Get an input by id
   *
   * @param id The ID of the requested input
   * @returns
   */
  getInput(id: string) {
    return this.child!.getInput(id);
  }
}
