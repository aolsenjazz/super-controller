import { Output, MidiMessage } from '@julusian/midi';

import { Port } from './port';

/**
 * Manages connection to a MIDI output port
 */
export class OutputPort extends Port<Output> {
  constructor(index: number, siblingIndex: number, name: string) {
    super(index, 'output', siblingIndex, name);
  }

  public send(msg: number[]) {
    this.port.sendMessage(msg as MidiMessage);
  }

  protected createPort(): Output {
    return new Output();
  }

  protected open() {
    this.port.openPort(this.index);
  }
}
