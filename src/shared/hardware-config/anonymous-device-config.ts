import { BasePlugin } from '@plugins/base-plugin';

import { MidiArray } from '../midi-array';
import { DeviceConfig } from './device-config';

export class AnonymousDeviceConfig extends DeviceConfig {
  constructor(
    portName: string,
    siblingIndex: number,
    nickname?: string,
    plugins: BasePlugin[] = []
  ) {
    super(portName, 'Anonymous', siblingIndex, nickname, plugins);
  }

  applyOverrides(mArray: MidiArray) {
    return mArray;
  }

  getResponse() {
    return undefined;
  }

  freeze() {
    return {
      ...this.innerFreeze(),
      className: this.constructor.name,
    };
  }
}
