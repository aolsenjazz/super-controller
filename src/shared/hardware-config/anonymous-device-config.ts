import { MidiArray } from '../midi-array';
import { DeviceConfig } from './device-config';

export class AnonymousDeviceConfig extends DeviceConfig {
  constructor(
    portName: string,
    siblingIndex: number,
    nickname?: string,
    plugins: string[] = []
  ) {
    super(portName, 'Anonymous', siblingIndex, nickname, plugins);
  }

  applyOverrides(mArray: MidiArray) {
    return mArray;
  }

  getResponse() {
    return undefined;
  }

  toDTO() {
    return {
      ...this.stub(),
      className: this.constructor.name,
    };
  }
}
