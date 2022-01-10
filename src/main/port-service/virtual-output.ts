import { Output } from 'midi';
import { Port } from './port';

/**
 * Manages a virtual output port. Virtual ports are opened automatically
 * for each connected MIDI device
 */
export class VirtualOutput implements Port {
  /* Carryover from `Port`. Ignored */
  index: number;

  /* nth-occurrence of this port. used when >1 devices of same model are connected */
  siblingIndex: number;

  /* 'input' | 'output' */
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  type = 'output' as 'output';

  /* name of the port */
  name: string;

  /* the port */
  port: Output;

  constructor(siblingIndex: number, name: string) {
    this.index = siblingIndex;
    this.name = name;
    this.siblingIndex = siblingIndex;

    this.port = new Output();
  }

  /* opens the port */
  open() {
    this.port.openVirtualPort(this.displayName);
  }

  /* closes the port */
  close() {
    this.port.closePort();
  }

  /**
   * Send the midi message thru the virtual port to clients
   *
   * @param msg The midi message
   */
  send(msg: number[]) {
    this.port.sendMessage(msg);
  }

  /* Carryover from `Port`. Throws if called */
  onMessage() {
    throw new Error('onMessage called on VirtualOutput');
  }

  isPortOpen() {
    return this.port.isPortOpen();
  }

  get displayName() {
    return this.siblingIndex === 0
      ? `SC ${this.name}`
      : `SC ${this.name} (${this.siblingIndex})`;
  }
}
