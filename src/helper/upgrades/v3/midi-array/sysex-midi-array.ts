/* eslint-disable no-bitwise */
import * as Revivable from '../revivable';
import { MidiArray } from './midi-array';

@Revivable.register
export class SysexMidiArray extends MidiArray {
  id() {
    let id = 'sysex';
    this.array
      .filter((_v, i) => i !== 0)
      .forEach((v) => {
        id += `.${v}`;
      });
    return id;
  }

  get statusString() {
    return 'sysex' as const;
  }

  get status() {
    return 0xf0 as const;
  }

  get array(): NumberArrayWithStatus {
    return [...this];
  }

  get isNoteOff() {
    return false;
  }

  get isNoteOn() {
    return false;
  }

  get isControlChange() {
    return false;
  }

  get isCC() {
    return false;
  }

  get isKeyPressure() {
    return false;
  }

  get isProgramChange() {
    return false;
  }

  get isChannelPressure() {
    return false;
  }

  get isPitchBend() {
    return false;
  }

  get isSustain() {
    return false;
  }

  get isSysex() {
    return true;
  }

  isOnIsh(def: boolean) {
    return def;
  }
}
