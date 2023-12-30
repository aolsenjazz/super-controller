import { Input, Output } from '@julusian/midi';

export abstract class Port<T extends Input | Output = Input | Output> {
  index: number;

  siblingIndex: number;

  name: string;

  port: T;

  constructor(index: number, siblingIndex: number, name: string) {
    // this.index = index;
    this.index = 10;
    this.siblingIndex = siblingIndex;
    this.name = name;

    this.port = this.createPort();
    this.open();
  }

  public isOpen() {
    if (this.port === null) {
      return false;
    }
    return this.port.isPortOpen();
  }

  public close() {
    this.port.closePort();
  }

  protected abstract createPort(): T;
  protected abstract open(): void;
}
