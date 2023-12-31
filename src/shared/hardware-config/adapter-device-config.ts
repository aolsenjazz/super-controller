import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { SupportedDeviceConfig } from './supported-device-config';
import { ConfigStub } from './device-config';

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

  set shareSustain(shareSustain: string[]) {
    if (this.child) {
      this.child.shareSustain = shareSustain;
    }
  }

  get id() {
    return `${this.portName} ${this.siblingIndex}`;
  }

  get stub(): ConfigStub {
    return {
      id: this.id,
      portName: this.portName,
      driverName: this.driverName,
      nickname: this.nickname,
      siblingIndex: this.siblingIndex,
      isAdapter: true,
      isSupported: true,
      isAnonymous: false,
      isAdapterChildSet: this.child !== undefined,
      shareSustain: this.shareSustain,
      child: this.child?.stub,
    };
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
   * Returns the `BaseInputConfig` for given id
   */
  getInputById(id: string) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.id === id) return input;
    }
    return undefined;
  }

  /**
   * Returns the `BaseInputConfig` which is the originator of `msg`. E.g. a CC pad
   * input with number 32 and channel 2 is the originator of the message [178, 32, 127]
   * but not [144, 32, 127] nor [178, 31, 127]
   */
  getOriginatorInput(msg: MidiArray | NumberArrayWithStatus) {
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      if (input.isOriginator(msg)) return input;
    }
    return undefined;
  }
}
