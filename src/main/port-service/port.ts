import { MidiValue } from 'midi-message-parser';
import midi from 'midi';

export class Port {
  index: number;

  siblingIndex: number;

  type: 'input' | 'output';

  name: string;

  port: midi.Input | midi.Output;

  constructor(
    index: number,
    siblingIndex: number,
    type: 'input' | 'output',
    name: string
  ) {
    this.index = index;
    this.siblingIndex = siblingIndex;
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

  send(msg: number[]) {
    if (this.port instanceof midi.Output) {
      this.port.sendMessage(msg);
    }
  }

  onMessage(cb: (deltaTime: number, msg: number[]) => void) {
    if (this.port instanceof midi.Input) {
      this.port.on('message', cb);
    }
  }

  isPortOpen() {
    return this.port.isPortOpen();
  }
}
