/**
 * Contains identifying information and connection status for ports
 */
export class PortInfo {
  /* is a device with matching ID connected? */
  readonly connected: boolean;

  /* Device-reported name */
  readonly name: string;

  /* nth-occurrence of device. Relevant when >1 devices of same model are connected */
  siblingIndex: number;

  constructor(name: string, siblingIndex: number, connected: boolean) {
    this.name = name;
    this.siblingIndex = siblingIndex;
    this.connected = connected;
  }

  get id() {
    return `${this.name} ${this.siblingIndex}`;
  }
}
