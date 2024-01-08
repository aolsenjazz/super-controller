import { MidiMessage } from '@julusian/midi';

import { OutputPort } from './output-port';

/**
 * Manages a virtual output port.
 */
export class VirtualOutput extends OutputPort {
  open() {
    this.port.openVirtualPort(this.displayName);
  }

  send(msg: number[]) {
    this.port.sendMessage(msg as MidiMessage);
  }

  get displayName() {
    return this.siblingIndex === 0
      ? `SC ${this.name}`
      : `SC ${this.name} (${this.siblingIndex})`;
  }
}
