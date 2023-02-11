import midi from '@julusian/midi';

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
      this.port.sendMessage(msg as midi.MidiMessage);
    }
  }

  onMessage(cb: (deltaTime: number, msg: MidiTuple) => void) {
    if (this.port instanceof midi.Input) {
      this.port.on('message', cb as (a: number, b: midi.MidiMessage) => void);
    }
  }

  isPortOpen() {
    return this.port.isPortOpen();
  }
}
