/**
 * Contains identifying information for hardware ports
 */
export class PortInfo {
  /**
   * The index of this port in its parent `midi.Input` or `midi.Output` list
   */
  readonly index: number;

  /**
   * OS-reported device name. This will differ per-OS and therefore consistent naming
   * conventions should not be relied upon
   */
  readonly name: string;

  readonly type: 'input' | 'output';

  /* nth-occurrence of device. Relevant when >1 devices of same model are connected */
  // TODO: why isn't this readonly?
  siblingIndex: number;

  constructor(
    index: number,
    type: 'input' | 'output',
    name: string,
    siblingIndex: number
  ) {
    this.index = index;
    this.type = type;
    this.name = name;
    this.siblingIndex = siblingIndex;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
  }
}
