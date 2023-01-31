import { MidiArray } from './midi-array';

export class DefaultPreservedMidiArray extends MidiArray {
  readonly default: MidiArray;

  constructor(items: [StatusNumber, MidiNumber, MidiNumber]) {
    super(items);

    this.default = new MidiArray(items);
  }
}
