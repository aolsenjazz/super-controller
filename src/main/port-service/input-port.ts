import { Input, MidiMessage } from '@julusian/midi';
import { Port } from './port';

export class InputPort extends Port<Input> {
  protected createPort() {
    return new Input();
  }

  protected open() {
    this.port.openPort(this.index);
  }

  onMessage(cb: (deltaTime: number, msg: MidiTuple) => void) {
    this.port.on('message', cb as (a: number, b: MidiMessage) => void);
  }
}
