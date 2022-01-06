import { MidiValue } from 'midi-message-parser';
import midi from 'midi';

export class Port {
  index: number;

  occurrenceNumber: number;

  type: 'input' | 'output';

  name: string;

  port: midi.Input | midi.Output;

  constructor(
    index: number,
    occurrenceNumber: number,
    type: 'input' | 'output',
    name: string
  ) {
    this.index = index;
    this.occurrenceNumber = occurrenceNumber;
    this.type = type;
    this.name = name;
    this.port = type === 'input' ? new midi.Input() : new midi.Output();
  }

  open() {
    this.port.openPort(this.index);
  }

  close() {
    this.port.closePort();
  }

  send(msg: MidiValue[]) {
    if (this.port instanceof midi.Output) {
      this.port.sendMessage(msg);
    }
  }

  onMessage(cb: (deltaTime: number, msg: number[]) => void) {
    if (this.port instanceof midi.Input) {
      this.port.on('message', cb);
    }
  }
}
