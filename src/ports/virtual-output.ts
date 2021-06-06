import { Port } from '@alexanderolsen/port-manager';
import { Output } from 'midi';

export class VirtualOutput implements Port {
  index: number;

  occurrenceNumber: number;

  type = 'output';

  name: string;

  port: Output;

  constructor(occurrenceNumber: number, name: string) {
    this.index = occurrenceNumber;
    this.name = name;
    this.occurrenceNumber = occurrenceNumber;

    this.port = new Output();
  }

  open() {
    this.port.openVirtualPort(this.name);
  }

  close() {
    this.port.closePort();
  }

  send(msg: number[]) {
    this.port.sendMessage(msg);
  }

  onMessage() {
    throw new Error('onMessage called on VirtualOutput');
  }
}
