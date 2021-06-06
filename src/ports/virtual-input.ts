import { Port } from '@alexanderolsen/port-manager';

import { Input } from 'midi';

export class VirtualInput implements Port {
  index: number;

  occurrenceNumber: number;

  type = 'input';

  name: string;

  port: Input;

  constructor(occurrenceNumber: number, name: string) {
    this.index = occurrenceNumber;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;

    this.port = new Input();
  }

  open() {
    this.port.openVirtualPort(this.name);
  }

  close() {
    this.port.closePort();
  }

  send() {
    throw new Error('send() called on VirtualInput');
  }

  onMessage(cb: (delta: number, message: number[]) => void) {
    this.port.on('message', cb);
  }
}
