import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { SupportedDeviceConfig } from './supported-device-config';

// TODO: Unclear if we really want to implement SupportedDeviceConfig or
// extends DeviceConfig. Gut says extend DeviceConfig but needs research
// TODO: yeah definitely don't want to implemenet Supported. Messes up instanceof checks downstream
@Revivable.register
export class AdapterDeviceConfig implements SupportedDeviceConfig {
  portName: string;

  driverName: string;

  isAdapter = true;

  nickname: string;

  supported = true;

  siblingIndex: number;

  child?: SupportedDeviceConfig;

  constructor(
    portName: string,
    driverName: string,
    siblingIndex: number,
    child?: SupportedDeviceConfig
  ) {
    this.portName = portName;
    this.driverName = driverName;
    this.nickname = portName;
    this.siblingIndex = siblingIndex;
    this.child = child;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.portName, this.driverName, this.siblingIndex, this.child],
    };
  }

  setChild(config: SupportedDeviceConfig) {
    this.child = config;
  }

  get isSet() {
    return this.child !== undefined;
  }

  bindingAvailable(
    statusString: StatusString | 'noteon/noteoff',
    number: number,
    channel: Channel
  ) {
    return this.child!.bindingAvailable(statusString, number, channel);
  }

  applyOverrides(msg: MidiArray) {
    if (this.child) {
      return this.child!.applyOverrides(msg);
    }
    return msg;
  }

  getResponse(msg: MidiArray) {
    if (this.child) {
      return this.child!.getResponse(msg);
    }
    return msg;
  }

  get inputs() {
    if (this.child) {
      return this.child!.inputs;
    }
    return [];
  }

  get shareSustain() {
    if (this.child) {
      return this.child.shareSustain;
    }
    return [];
  }

  get id() {
    return `${this.portName} ${this.siblingIndex}`;
  }

  shareWith(id: string) {
    if (this.child) {
      this.child!.shareWith(id);
    }
  }

  stopSharing(id: string) {
    if (this.child) {
      this.child!.stopSharing(id);
    }
  }

  sharingWith(id: string) {
    if (this.child) {
      return this.child!.sharingWith(id);
    }
    return false;
  }

  /**
   * Get an input by id
   *
   * @param id The ID of the requested input
   * @returns
   */
  getInput(id: string) {
    if (this.child) {
      return this.child!.getInput(id);
    }
    return undefined;
  }
}
