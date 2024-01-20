import { BasePlugin } from '@plugins/base-plugin';

import * as Revivable from '../revivable';
import { MidiArray } from '../midi-array';
import { DeviceConfig } from './device-config';

export interface ImmutableMidiArrayMap {
  get(key: string): MidiArray | undefined;
}

@Revivable.register
export class AnonymousDeviceConfig extends DeviceConfig {
  constructor(
    portName: string,
    siblingIndex: number,
    nickname?: string,
    plugins: BasePlugin[] = []
  ) {
    super(portName, 'Anonymous', siblingIndex, nickname, plugins);
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.portName, this.siblingIndex, this.nickname],
    };
  }

  applyOverrides(mArray: MidiArray) {
    return mArray;
  }

  getResponse() {
    return undefined;
  }
}
