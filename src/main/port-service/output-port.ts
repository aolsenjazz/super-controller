import { Output, MidiMessage } from '@julusian/midi';

import { Port } from './port';

/**
 * Manages connection to a MIDI output port
 */
export class OutputPort extends Port<Output> {
  protected createPort(): Output {
    return new Output();
  }

  protected open() {
    this.port.openPort(this.index);
  }

  send(msg: number[]) {
    this.port.sendMessage(msg as MidiMessage);
  }
}
