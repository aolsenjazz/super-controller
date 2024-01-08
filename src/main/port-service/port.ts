import { Input, Output } from '@julusian/midi';
import { PortInfo } from '@shared/port-info';

/**
 * Base class for `InputPort` and `OutputPort`s. Upon instantiation, open a connection
 * to the input or output port using the `this.index`
 */
export abstract class Port<
  T extends Input | Output = Input | Output
> extends PortInfo {
  port: T;

  constructor(
    index: number,
    type: 'input' | 'output',
    siblingIndex: number,
    name: string
  ) {
    super(index, type, name, siblingIndex);

    this.port = this.createPort();
    this.open();
  }

  public close() {
    this.port.closePort();
  }

  protected abstract createPort(): T;
  protected abstract open(): void;
}
