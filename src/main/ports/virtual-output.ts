import { Port } from '@alexanderolsen/port-manager';
import { Output } from 'midi';

/**
 * Manages a virtual output port. Virtual ports are opened automatically
 * for each connected MIDI device
 */
export class VirtualOutput implements Port {
  /* Carryover from `Port`. Ignored */
  index: number;

  /* nth-occurrence of this port. used when >1 devices of same model are connected */
  occurrenceNumber: number;

  /* 'input' | 'output' */
  type = 'output';

  /* name of the port */
  name: string;

  /* the port */
  port: Output;

  constructor(occurrenceNumber: number, name: string) {
    this.index = occurrenceNumber;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;

    this.port = new Output();
  }

  /* opens the port */
  open() {
    this.port.openVirtualPort(this.name);
  }

  /* closes the port */
  close() {
    this.port.closePort();
  }

  /**
   * Send the midi message thru the virtual port to clients
   *
   * @param { number[] } msg The midi message
   */
  send(msg: number[]) {
    this.port.sendMessage(msg);
  }

  /* Carryover from `Port`. Throws if called */
  onMessage() {
    throw new Error('onMessage called on VirtualOutput');
  }
}
