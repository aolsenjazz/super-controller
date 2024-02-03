import { BasePlugin } from '@plugins/base-plugin';

import { MidiArray } from '../midi-array';
import { DeviceConfig } from './device-config';

export interface ImmutableMidiArrayMap {
  get(key: string): MidiArray | undefined;
}

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
}
