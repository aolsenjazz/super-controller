import { InputPort } from '../input-port';

/**
 * Manages a virtual input port.
 */
export class VirtualInput extends InputPort {
  constructor(siblingIndex: number, name: string) {
    super(0, siblingIndex, name);
  }

  protected open() {
    this.port.openVirtualPort(this.displayName);
  }

  get displayName() {
    return this.siblingIndex === 0
      ? `SC ${this.name}`
      : `SC ${this.name} (${this.siblingIndex})`;
  }
}
