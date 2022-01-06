import { Input } from 'midi';
import { Port } from './port';

/**
 * @callback cb
 * @param delta Delta time
 * @param message The MIDI message triplet from device
 */

/**
 * Manages a virtual input port. Virtual ports are opened automatically
 * for each connected MIDI device
 */
export class VirtualInput implements Port {
  /* Carryover from `Port`. Ignored */
  index: number;

  /* nth-occurrence of this port. used when >1 devices of same model are connected */
  occurrenceNumber: number;

  /* 'input' | 'output' */
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  type = 'input' as 'input';

  /* name of the port */
  name: string;

  /* the port */
  port: Input;

  constructor(occurrenceNumber: number, name: string) {
    this.index = occurrenceNumber;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;

    this.port = new Input();
  }

  /* opens the port */
  open() {
    this.port.openVirtualPort(this.name);
  }

  /* closes the port */
  close() {
    this.port.closePort();
  }

  /* overriden from `Port`. throws if called */
  send() {
    throw new Error('send() called on VirtualInput');
  }

  /**
   * Set a callback for when messages are received from the `Port`
   *
   * @param cb The callback
   */
  onMessage(cb: (delta: number, message: number[]) => void) {
    this.port.on('message', cb);
  }
}
