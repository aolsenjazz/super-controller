import { Input, Output } from '@julusian/midi';

/**
 * Base class for `InputPort` and `OutputPort`s. Upon instantiation, open a connection
 * to the input or output port using the `this.index`
 */
export abstract class Port<T extends Input | Output = Input | Output> {
  index: number;

  siblingIndex: number;

  name: string;

  port: T;

  constructor(index: number, siblingIndex: number, name: string) {
    this.index = index;
    this.siblingIndex = siblingIndex;
    this.name = name;

    this.port = this.createPort();
    this.open();
  }

  public close() {
    this.port.closePort();
  }

  protected abstract createPort(): T;
  protected abstract open(): void;
}
